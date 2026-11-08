import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/auth_api.dart';
import '../../../core/widgets/app_button.dart';
import 'auth_screen.dart';

class PasswordRecoveryScreen extends ConsumerStatefulWidget {
  final String? token;
  final String? email;
  final bool isReset;

  const PasswordRecoveryScreen({super.key, this.token, this.email, this.isReset = false});

  @override
  ConsumerState<PasswordRecoveryScreen> createState() => _PasswordRecoveryScreenState();
}

class _PasswordRecoveryScreenState extends ConsumerState<PasswordRecoveryScreen> {
  final _form = GlobalKey<FormState>();
  late final TextEditingController _email;
  final _password = TextEditingController();
  final _confirmation = TextEditingController();
  bool _busy = false;
  bool _complete = false;
  String? _error;
  String? _message;

  bool get _validLink => widget.token?.length == 64 && (widget.email?.contains('@') ?? false);

  @override
  void initState() {
    super.initState();
    _email = TextEditingController(text: widget.email ?? '');
  }

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _confirmation.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_busy || !_form.currentState!.validate()) return;
    setState(() { _busy = true; _error = null; });
    try {
      final api = ref.read(authApiProvider);
      if (widget.isReset) {
        await api.resetPassword(email: _email.text.trim(), token: widget.token!,
          password: _password.text, confirmation: _confirmation.text);
        _message = 'Your password has been updated. Sign in with your new password.';
      } else {
        _message = await api.forgotPassword(_email.text.trim());
      }
      if (!mounted) return;
      setState(() => _complete = true);
      _password.clear();
      _confirmation.clear();
    } on DioException catch (error) {
      if (!mounted) return;
      final data = error.response?.data;
      final detail = data is Map ? data['detail'] : null;
      setState(() => _error = detail is String ? detail :
        'Unable to complete this request. Check your connection and try again.');
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to complete this request. Please try again.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _signIn() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const AuthScreen()), (route) => route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    final invalidLink = widget.isReset && !_validLink;
    return Scaffold(
      appBar: AppBar(title: Text(widget.isReset ? 'Reset password' : 'Forgot password')),
      body: Center(child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 420),
          child: Form(key: _form, child: Column(mainAxisSize: MainAxisSize.min, children: [
            if (invalidLink) ...[
              const Text('This reset link is incomplete. Request a new link to continue.'),
              const SizedBox(height: 16),
              AppButton(text: 'Request a new link', onPressed: () => Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const PasswordRecoveryScreen()))),
            ] else if (_complete) ...[
              const Icon(Icons.check_circle_outline, size: 48, color: Colors.green),
              const SizedBox(height: 16),
              Text(_message!, textAlign: TextAlign.center),
              const SizedBox(height: 24),
              AppButton(text: 'Back to sign in', onPressed: _signIn),
            ] else ...[
              Text(widget.isReset ? 'Choose a new password for your account.' :
                'Enter your email address to receive a password reset link.'),
              const SizedBox(height: 24),
              TextFormField(controller: _email, readOnly: widget.isReset,
                keyboardType: TextInputType.emailAddress, autofillHints: const [AutofillHints.email],
                decoration: const InputDecoration(labelText: 'Email address'),
                validator: (value) => value == null || !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(value.trim())
                  ? 'Enter a valid email address' : null),
              if (widget.isReset) ...[
                const SizedBox(height: 16),
                TextFormField(controller: _password, obscureText: true,
                  autofillHints: const [AutofillHints.newPassword],
                  decoration: const InputDecoration(labelText: 'New password'),
                  validator: (value) => value == null || value.length < 8
                    ? 'Use at least 8 characters' : null),
                const SizedBox(height: 16),
                TextFormField(controller: _confirmation, obscureText: true,
                  decoration: const InputDecoration(labelText: 'Confirm password'),
                  validator: (value) => value != _password.text ? 'Passwords do not match' : null),
              ],
              if (_error != null) ...[
                const SizedBox(height: 16),
                Text(_error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                if (widget.isReset) TextButton(onPressed: _busy ? null : () => Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => PasswordRecoveryScreen(email: widget.email))),
                  child: const Text('Request a new link')),
              ],
              const SizedBox(height: 24),
              AppButton(text: widget.isReset ? 'Update password' : 'Send reset link',
                isLoading: _busy, onPressed: _submit),
            ],
          ])),
        ),
      )),
    );
  }
}
