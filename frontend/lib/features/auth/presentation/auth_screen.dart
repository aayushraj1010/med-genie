import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import 'password_recovery_screen.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool isLogin = true;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (next.isAuthenticated) {
        if (Navigator.of(context).canPop()) {
          Navigator.of(context).pop();
        }
      }
    });

    final authState = ref.watch(authProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0F172A)],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Card(
                color: const Color(0xFF1E293B),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(
                    color: const Color(0xFF10B981).withValues(alpha: 0.3),
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Logo / Title
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(
                              0xFF10B981,
                            ).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Text(
                            "🩺",
                            style: TextStyle(fontSize: 36),
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          "Wellness",
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF10B981),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          isLogin
                              ? "Welcome back! Sign in to continue"
                              : "Create your secure health account",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 28),

                        // Error message
                        if (authState.errorMessage != null) ...[
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: Colors.red.withValues(alpha: 0.5),
                              ),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.error_outline,
                                  color: Colors.redAccent,
                                  size: 18,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    authState.errorMessage!,
                                    style: const TextStyle(
                                      color: Colors.redAccent,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Name field (register only)
                        if (!isLogin) ...[
                          AppTextField(
                            controller: _nameCtrl,
                            labelText: "Full Name",
                            prefixIcon: const Icon(Icons.person_outline),
                            validator: (v) => (v == null || v.trim().length < 2)
                                ? "Enter at least 2 characters"
                                : null,
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Email
                        AppTextField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          labelText: "Email Address",
                          prefixIcon: const Icon(Icons.email_outlined),
                          validator: (v) => (v == null || !v.contains('@'))
                              ? "Enter a valid email"
                              : null,
                        ),
                        const SizedBox(height: 16),

                        // Password
                        AppTextField(
                          controller: _passwordCtrl,
                          obscureText: _obscurePassword,
                          labelText: "Password",
                          prefixIcon: const Icon(Icons.lock_outline),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                            ),
                            onPressed: () => setState(
                              () => _obscurePassword = !_obscurePassword,
                            ),
                          ),
                          validator: (v) => (v == null || v.length < 8)
                              ? "Password must be at least 8 characters"
                              : null,
                        ),
                        const SizedBox(height: 28),

                        // Submit button
                        AppButton(
                          text: isLogin ? "Sign In" : "Create Account",
                          isLoading: authState.isLoading,
                          backgroundColor: const Color(0xFF10B981),
                          textColor: Colors.black,
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              if (isLogin) {
                                ref
                                    .read(authProvider.notifier)
                                    .login(
                                      _emailCtrl.text.trim(),
                                      _passwordCtrl.text,
                                    );
                              } else {
                                ref
                                    .read(authProvider.notifier)
                                    .register(
                                      _nameCtrl.text.trim(),
                                      _emailCtrl.text.trim(),
                                      _passwordCtrl.text,
                                    );
                              }
                            }
                          },
                        ),
                        const SizedBox(height: 16),

                        if (isLogin) TextButton(
                          onPressed: authState.isLoading ? null : () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => PasswordRecoveryScreen(email: _emailCtrl.text.trim()))),
                          child: const Text('Forgot password?'),
                        ),

                        // Toggle login/register
                        TextButton(
                          onPressed: () {
                            setState(() {
                              isLogin = !isLogin;
                            });
                          },
                          child: Text(
                            isLogin
                                ? "Don't have an account? Sign Up"
                                : "Already have an account? Sign In",
                            style: const TextStyle(color: Color(0xFF3B82F6)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
