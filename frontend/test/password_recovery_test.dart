import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:frontend/app/router.dart';
import 'package:frontend/features/auth/data/auth_api.dart';
import 'package:frontend/features/auth/presentation/password_recovery_screen.dart';

class FakeRecoveryApi extends AuthApi {
  FakeRecoveryApi() : super(Dio());
  String? requestedEmail;
  String? resetToken;
  String? resetPasswordValue;
  bool unavailable = false;

  @override
  Future<String> forgotPassword(String email) async {
    requestedEmail = email;
    if (unavailable) {
      throw DioException(requestOptions: RequestOptions(path: '/auth/forgot-password'),
        response: Response(requestOptions: RequestOptions(), statusCode: 503,
          data: {'detail': 'Password reset email is temporarily unavailable.'}));
    }
    return 'If an account exists for this email, a password reset link has been sent.';
  }

  @override
  Future<void> resetPassword({required String email, required String token,
    required String password, required String confirmation}) async {
    requestedEmail = email;
    resetToken = token;
    resetPasswordValue = password;
  }
}

void main() {
  Future<void> showRecovery(WidgetTester tester, FakeRecoveryApi api,
    {bool reset = false}) async {
    await tester.pumpWidget(ProviderScope(overrides: [authApiProvider.overrideWithValue(api)],
      child: MaterialApp(home: PasswordRecoveryScreen(isReset: reset,
        token: reset ? 'a' * 64 : null, email: reset ? 'user@example.com' : null))));
  }

  testWidgets('Forgot password submits email and shows generic confirmation', (tester) async {
    final api = FakeRecoveryApi();
    await showRecovery(tester, api);
    await tester.enterText(find.byType(TextFormField), 'user@example.com');
    await tester.tap(find.text('Send reset link'));
    await tester.pumpAndSettle();
    expect(api.requestedEmail, 'user@example.com');
    expect(find.textContaining('If an account exists'), findsOneWidget);
  });

  testWidgets('Email delivery failure stays actionable', (tester) async {
    final api = FakeRecoveryApi()..unavailable = true;
    await showRecovery(tester, api);
    await tester.enterText(find.byType(TextFormField), 'user@example.com');
    await tester.tap(find.text('Send reset link'));
    await tester.pumpAndSettle();
    expect(find.text('Password reset email is temporarily unavailable.'), findsOneWidget);
    expect(find.text('Send reset link'), findsOneWidget);
    expect(find.textContaining('If an account exists'), findsNothing);
  });

  testWidgets('Reset validates confirmation before submitting the link token', (tester) async {
    final api = FakeRecoveryApi();
    await showRecovery(tester, api, reset: true);
    final fields = find.byType(TextFormField);
    await tester.enterText(fields.at(1), 'newpassword123');
    await tester.enterText(fields.at(2), 'differentpassword');
    await tester.ensureVisible(find.text('Update password'));
    await tester.tap(find.text('Update password'));
    await tester.pumpAndSettle();
    expect(find.text('Passwords do not match'), findsOneWidget);
    expect(api.resetToken, isNull);
    await tester.enterText(fields.at(2), 'newpassword123');
    await tester.tap(find.text('Update password'));
    await tester.pumpAndSettle();
    expect(api.resetToken, 'a' * 64);
    expect(api.resetPasswordValue, 'newpassword123');
    expect(find.textContaining('Your password has been updated'), findsOneWidget);
  });

  testWidgets('Incomplete reset link offers a new request', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: MaterialApp(
      home: PasswordRecoveryScreen(isReset: true))));
    expect(find.textContaining('This reset link is incomplete'), findsOneWidget);
    expect(find.text('Request a new link'), findsOneWidget);
    expect(find.text('Update password'), findsNothing);
  });

  testWidgets('Reset deep link decodes email and token', (tester) async {
    await tester.pumpWidget(ProviderScope(child: MaterialApp(
      initialRoute: '/reset-password?token=${'a' * 64}&email=user%2Btag%40example.com',
      onGenerateRoute: AppRouter.generateRoute,
    )));
    await tester.pumpAndSettle();
    expect(find.text('user+tag@example.com'), findsOneWidget);
    expect(find.text('Update password'), findsOneWidget);
  });
}
