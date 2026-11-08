import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/features/chat/data/models/chat_model.dart';

void main() {
  test('Saved fallback source survives history decoding', () {
    final message = ChatMessageModel.fromJson({
      'content': 'General guidance', 'sender': 'ai',
      'metadata': '{"source":"local_fallback","fallbackReason":"timeout"}',
    });
    expect(message.source, 'local_fallback');
    final response = ChatSendResponseModel.fromJson({
      'answer': 'General guidance', 'source': 'local_fallback',
    });
    expect(response.source, message.source);
  });

  test('Legacy history without valid metadata keeps an unknown source', () {
    for (final metadata in [null, 'old text', '{}']) {
      final message = ChatMessageModel.fromJson({
        'content': 'Old message', 'sender': 'ai', 'metadata': metadata,
      });
      expect(message.source, isNull);
    }
  });
}
