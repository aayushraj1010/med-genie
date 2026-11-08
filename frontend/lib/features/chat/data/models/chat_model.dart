import 'dart:convert';

class ChatSessionModel {
  final String sessionId;
  final String title;
  final DateTime createdAt;
  final DateTime updatedAt;

  ChatSessionModel({
    required this.sessionId,
    required this.title,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ChatSessionModel.fromJson(Map<String, dynamic> json) {
    return ChatSessionModel(
      sessionId: json['sessionId'] as String,
      title: json['title'] as String? ?? 'Chat Session',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

class ChatMessageModel {
  final String? source;
  final String content;
  final String sender; // 'user' or 'ai'
  final DateTime timestamp;
  final bool isFollowUp;

  ChatMessageModel({
    this.source,
    required this.content,
    required this.sender,
    required this.timestamp,
    this.isFollowUp = false,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    String? source;
    try {
      final metadata = json['metadata'];
      final decoded = metadata is String ? jsonDecode(metadata) : metadata;
      if (decoded is Map && decoded['source'] is String) {
        source = decoded['source'] as String;
      }
    } on FormatException {
      // Older messages may not have structured metadata.
    }
    return ChatMessageModel(
      source: source,
      content: json['content'] as String,
      sender: json['sender'] as String,
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'] as String) ?? DateTime.now()
          : DateTime.now(),
      isFollowUp: json['isFollowUp'] as bool? ?? false,
    );
  }
}

class ChatSendResponseModel {
  final String? source;
  final String answer;
  final String followUpQuestion;

  ChatSendResponseModel({
    this.source,
    required this.answer,
    required this.followUpQuestion,
  });

  factory ChatSendResponseModel.fromJson(Map<String, dynamic> json) {
    return ChatSendResponseModel(
      source: json['source'] as String?,
      answer: json['answer'] as String? ?? '',
      followUpQuestion: json['followUpQuestion'] as String? ?? '',
    );
  }
}
