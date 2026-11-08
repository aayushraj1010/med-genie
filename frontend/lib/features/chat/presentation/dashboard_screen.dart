import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../providers/chat_provider.dart';
import '../../auth/providers/auth_provider.dart';
import '../../profile/presentation/health_profile_screen.dart';
import '../../risk/presentation/heart_risk_screen.dart';
import '../../specialist/presentation/specialist_screen.dart';
import '../../contact/presentation/contact_screen.dart';
import '../../../app/theme.dart';
import '../../../core/widgets/medical_disclaimer_banner.dart';
import '../../../core/constants/app_text.dart';
import 'chat_history_drawer.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  final _msgCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  bool _speechAvailable = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(chatProvider.notifier).startNewSession();
      _initSpeech();
    });
  }

  Future<void> _initSpeech() async {
    try {
      _speechAvailable = await _speech.initialize(
        onError: (val) => setState(() => _isListening = false),
        onStatus: (val) {
          if (val == 'done' || val == 'notListening') {
            setState(() => _isListening = false);
          }
        },
      );
      setState(() {});
    } catch (_) {}
  }

  void _toggleListening() async {
    if (!_speechAvailable) return;
    if (_isListening) {
      await _speech.stop();
      setState(() => _isListening = false);
    } else {
      setState(() => _isListening = true);
      await _speech.listen(
        onResult: (result) {
          setState(() {
            _msgCtrl.text = result.recognizedWords;
            _msgCtrl.selection = TextSelection.fromPosition(
              TextPosition(offset: _msgCtrl.text.length),
            );
          });
        },
        listenOptions: stt.SpeechListenOptions(
          listenFor: const Duration(seconds: 30),
          pauseFor: const Duration(seconds: 5),
          localeId: 'en_US',
        ),
      );
    }
  }

  void _sendMessage() {
    if (_msgCtrl.text.trim().isNotEmpty) {
      ref.read(chatProvider.notifier).sendMessage(_msgCtrl.text.trim());
      _msgCtrl.clear();
      Future.delayed(const Duration(milliseconds: 200), () {
        if (_scrollCtrl.hasClients) {
          _scrollCtrl.animateTo(
            _scrollCtrl.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    }
  }

  @override
  void dispose() {
    _msgCtrl.dispose();
    _scrollCtrl.dispose();
    _speech.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chatMessages = ref.watch(chatProvider);
    final authState = ref.watch(authProvider);
    final isDark = ref.watch(themeModeProvider) == ThemeMode.dark;

    // Auto-scroll when new messages arrive
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text("🩺", style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Wellness",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  "Hello, ${authState.userName ?? 'User'}",
                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Theme toggle
          IconButton(
            icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode,
                color: Colors.amber),
            tooltip: "Toggle Theme",
            onPressed: () => ref.read(themeModeProvider.notifier).toggle(),
          ),
          // Heart Risk Evaluator
          IconButton(
            icon: const Icon(Icons.favorite_border, color: Colors.pinkAccent),
            tooltip: "Heart Risk Evaluator",
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const HeartRiskScreen()),
            ),
          ),
          // Specialist recommendation
          IconButton(
            icon: const Icon(Icons.medical_services_outlined,
                color: Color(0xFF3B82F6)),
            tooltip: "Find a Specialist",
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const SpecialistScreen()),
            ),
          ),
          // Health Profile
          IconButton(
            icon: const Icon(Icons.manage_accounts_outlined),
            tooltip: "Update Vitals",
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => const HealthProfileScreen()),
            ),
          ),
          // Logout
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: () => ref.read(authProvider.notifier).logout(),
          ),
        ],
      ),
      // Chat history drawer
      endDrawer: const ChatHistoryDrawer(),
      body: Column(
        children: [
          // Emergency banner
          MedicalDisclaimerBanner(
            message: AppText.emergencyWarning,
            icon: Icons.warning_amber_rounded,
            trailing: TextButton.icon(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (_) => const SpecialistScreen()),
              ),
              icon: const Icon(Icons.open_in_new,
                  size: 14, color: Color(0xFF3B82F6)),
              label: const Text("Specialists",
                  style: TextStyle(
                      fontSize: 12, color: Color(0xFF3B82F6))),
            ),
          ),

          // Chat messages
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: chatMessages.length,
              itemBuilder: (context, index) {
                final msg = chatMessages[index];
                final isUser = msg.sender == 'user';
                return _buildMessageBubble(msg, isUser, context);
              },
            ),
          ),

          // Input area
          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 16),
            decoration: BoxDecoration(
              color: isDark
                  ? const Color(0xFF1E293B)
                  : Colors.white,
              border: Border(
                top: BorderSide(
                  color: Colors.white.withValues(alpha: 0.08),
                ),
              ),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  // Contact button
                  IconButton(
                    icon: const Icon(Icons.mail_outline,
                        color: Colors.grey, size: 22),
                    tooltip: "Contact Us",
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const ContactScreen()),
                    ),
                  ),
                  // Text field
                  Expanded(
                    child: TextField(
                      controller: _msgCtrl,
                      maxLines: 3,
                      minLines: 1,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _sendMessage(),
                      decoration: InputDecoration(
                        hintText: _isListening
                            ? "Listening..."
                            : "Ask about symptoms, medications...",
                        hintStyle: TextStyle(
                          color: _isListening
                              ? Colors.greenAccent
                              : Colors.grey.shade600,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                        filled: true,
                        fillColor: isDark
                            ? const Color(0xFF0F172A)
                            : const Color(0xFFF1F5F9),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                        isDense: true,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Voice button
                  if (_speechAvailable)
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isListening
                            ? Colors.redAccent
                            : Colors.grey.withValues(alpha: 0.2),
                      ),
                      child: IconButton(
                        icon: Icon(
                          _isListening ? Icons.mic : Icons.mic_none,
                          color: _isListening ? Colors.white : Colors.grey,
                        ),
                        onPressed: _toggleListening,
                        tooltip: _isListening ? "Stop" : "Speak",
                      ),
                    ),
                  const SizedBox(width: 4),
                  // Send button
                  CircleAvatar(
                    backgroundColor: const Color(0xFF10B981),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_upward, color: Colors.black),
                      onPressed: _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(
      ChatMessage msg, bool isUser, BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.78,
        ),
        margin: const EdgeInsets.symmetric(vertical: 5),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isUser
              ? const Color(0xFF10B981)
              : const Color(0xFF1E293B),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isUser
                ? const Radius.circular(16)
                : const Radius.circular(4),
            bottomRight: isUser
                ? const Radius.circular(4)
                : const Radius.circular(16),
          ),
          border: isUser
              ? null
              : Border.all(color: Colors.white.withValues(alpha: 0.06)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser)
              const Padding(
                padding: EdgeInsets.only(bottom: 6),
                child: Text(
                  "🩺 Wellness",
                  style: TextStyle(
                    color: Color(0xFF10B981),
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            Text(
              msg.text,
              style: TextStyle(
                color: isUser ? Colors.black87 : Colors.white,
                fontSize: 14.5,
                height: 1.4,
              ),
            ),
            if (!isUser && msg.source == 'local_fallback') ...[
              const SizedBox(height: 8),
              const Text('General guidance · AI unavailable',
                style: TextStyle(color: Colors.amber, fontSize: 12)),
            ],
            if (msg.isFollowUpPrompt) ...[
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B82F6),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 8),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const HealthProfileScreen()),
                    ),
                    icon: const Icon(Icons.edit_note, size: 16),
                    label: const Text("Update Health Profile",
                        style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 4),
            Text(
              "${msg.timestamp.hour.toString().padLeft(2, '0')}:${msg.timestamp.minute.toString().padLeft(2, '0')}",
              style: TextStyle(
                color: isUser
                    ? Colors.black54
                    : Colors.grey.shade600,
                fontSize: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

