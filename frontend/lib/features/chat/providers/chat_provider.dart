import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/chat_api.dart';

class ChatMessage {
  final String? source;
  final String text;
  final String sender; // 'user' or 'ai'
  final DateTime timestamp;
  final bool isFollowUpPrompt;

  ChatMessage({
    this.source,
    required this.text,
    required this.sender,
    required this.timestamp,
    this.isFollowUpPrompt = false,
  });
}

class ChatNotifier extends Notifier<List<ChatMessage>> {
  ChatApi get _chatApi => ref.read(chatApiProvider);
  String? activeSessionId;

  @override
  List<ChatMessage> build() {
    return [];
  }

  Future<void> startNewSession() async {
    activeSessionId = null;
    state = [
      ChatMessage(
        text:
            "Hello! I'm Wellness, your AI health assistant. How can I help you today?\n\nTip: Fill out your Health Profile for more personalized answers.",
        sender: 'ai',
        timestamp: DateTime.now(),
      )
    ];
    try {
      final session = await _chatApi.createSession("New Chat Session");
      activeSessionId = session.sessionId;
    } catch (_) {}
  }

  Future<void> loadSession(String sessionId) async {
    activeSessionId = sessionId;
    state = [
      ChatMessage(
        text: "Loading session history...",
        sender: 'ai',
        timestamp: DateTime.now(),
      )
    ];
    try {
      final messages = await _chatApi.getSessionMessages(sessionId);
      state = messages.map((m) => ChatMessage(
        source: m.source,
        text: m.content,
        sender: m.sender,
        timestamp: m.timestamp,
        isFollowUpPrompt: m.isFollowUp,
      )).toList();
      
      if (state.isEmpty) {
        state = [
          ChatMessage(
            text: "Session resumed. Continue your conversation below.",
            sender: 'ai',
            timestamp: DateTime.now(),
          )
        ];
      }
    } catch (_) {
      state = [
        ChatMessage(
          text: "Failed to load session history. Please try again.",
          sender: 'ai',
          timestamp: DateTime.now(),
        )
      ];
    }
  }

  Future<void> sendMessage(String text) async {
    if (activeSessionId == null) {
      await startNewSession();
    }

    final userMsg = ChatMessage(
      text: text,
      sender: 'user',
      timestamp: DateTime.now(),
    );
    state = [...state, userMsg];

    final thinkingMsg = ChatMessage(
      text: "Thinking...",
      sender: 'ai',
      timestamp: DateTime.now(),
    );
    state = [...state, thinkingMsg];

    try {
      final response = await _chatApi.sendMessage(activeSessionId!, text);
      state = state.where((msg) => msg.text != "Thinking...").toList();

      state = [
        ...state,
        ChatMessage(
          text: response.answer,
          source: response.source,
          sender: 'ai',
          timestamp: DateTime.now(),
        )
      ];

      if (response.followUpQuestion.isNotEmpty) {
        state = [
          ...state,
          ChatMessage(
            text: response.followUpQuestion,
            source: response.source,
            sender: 'ai',
            timestamp: DateTime.now(),
            isFollowUpPrompt: true,
          )
        ];
      }
    } on DioException catch (_) {
      state = state.where((msg) => msg.text != "Thinking...").toList();
      state = [
        ...state,
        ChatMessage(
          text:
              "I encountered an issue connecting to the AI service. Please check your connection and try again.",
          sender: 'ai',
          timestamp: DateTime.now(),
        )
      ];
    }
  }

  void clearMessages() {
    state = [];
    activeSessionId = null;
  }
}

final chatProvider =
    NotifierProvider<ChatNotifier, List<ChatMessage>>(ChatNotifier.new);

