import { NextRequest, NextResponse } from 'next/server';
import { healthQuestionAnswering } from '@/ai/flows/health-question-answering';

const encoder = new TextEncoder();

function chunkText(text: string) {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    if (trimmedSentence.length <= 96) {
      chunks.push(trimmedSentence);
      continue;
    }

    const words = trimmedSentence.split(/\s+/);
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > 72 && current) {
        chunks.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    if (current) {
      chunks.push(current);
    }
  }

  return chunks;
}

function toSseEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question = typeof body.question === 'string' ? body.question : typeof body.message === 'string' ? body.message : '';
    const medicalHistory = typeof body.medicalHistory === 'string' ? body.medicalHistory : '';
    const lifestyle = typeof body.lifestyle === 'string' ? body.lifestyle : '';
    const symptoms = typeof body.symptoms === 'string' ? body.symptoms : '';

    if (!question.trim()) {
      return NextResponse.json({ response: 'Please send a question.' }, { status: 400 });
    }

    const result = await healthQuestionAnswering({
      question: question.trim(),
      medicalHistory,
      lifestyle,
      symptoms,
    });

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        (async () => {
          try {
            for (const chunk of chunkText(result.answer)) {
              controller.enqueue(encoder.encode(toSseEvent('chunk', { text: chunk })));
              await new Promise((resolve) =>
                setTimeout(resolve, Math.min(60, 12 + chunk.length * 1.2))
              );
            }

            controller.enqueue(
              encoder.encode(
                toSseEvent('meta', {
                  additionalQuestions: result.additionalQuestions ?? [],
                })
              )
            );
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        })();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { response: "I'm having trouble thinking right now. Try again!" },
      { status: 500 }
    );
  }
}