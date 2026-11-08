import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/auth/presentation/auth_screen.dart';
import 'package:frontend/features/chat/presentation/dashboard_screen.dart';
import 'package:frontend/features/profile/presentation/health_profile_screen.dart';
import 'package:frontend/features/risk/presentation/heart_risk_screen.dart';

import 'package:frontend/features/auth/providers/auth_provider.dart';
import 'package:frontend/features/chat/providers/chat_provider.dart';
import 'package:frontend/features/profile/data/profile_api.dart';
import 'package:frontend/features/profile/data/models/profile_model.dart';
import 'package:frontend/features/risk/state/risk_provider.dart';

class FakeProfileApi implements ProfileApi {
  @override
  Future<UserProfileModel> getProfile() async {
    return UserProfileModel(
      id: 1,
      name: "Mock User",
      email: "mock@example.com",
      role: "user",
      healthProfile: HealthProfileModel(
        medicalHistory: "Asthma",
        lifestyle: "Active",
        symptoms: "None",
        allergies: "Peanuts",
        medications: "Inhaler",
      ),
    );
  }

  @override
  Future<HealthProfileModel> updateProfile(HealthProfileModel profile) async {
    return profile;
  }
}

class MockAuthNotifier extends AuthNotifier {
  @override
  AuthState build() {
    return AuthState(
      isAuthenticated: true,
      userName: "Mock User",
      userEmail: "mock@example.com",
    );
  }
}

class MockChatNotifier extends ChatNotifier {
  @override
  List<ChatMessage> build() {
    return [
      ChatMessage(text: "Hello! I am mock Wellness.", sender: "ai", timestamp: DateTime.now(), source: 'local_fallback'),
      ChatMessage(text: "Hello AI!", sender: "user", timestamp: DateTime.now()),
    ];
  }
  @override
  Future<void> startNewSession() async {}
}

class MockRiskNotifier extends RiskNotifier {
  @override
  RiskState build() {
    return RiskState(
      resultScore: 12.5,
      resultClass: 0,
      engineUsed: "fallback_clinical_matrix",
    );
  }
}

void main() {
  testWidgets('AuthScreen widget check', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: AuthScreen(),
        ),
      ),
    );

    // Verify presence of title, email and password fields, and buttons
    expect(find.text("Wellness"), findsOneWidget);
    expect(find.byType(TextFormField), findsNWidgets(2)); // Email, Password
    expect(find.text("Sign In"), findsOneWidget);
    expect(find.text("Don't have an account? Sign Up"), findsOneWidget);
  });

  testWidgets('DashboardScreen widget check', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authProvider.overrideWith(() => MockAuthNotifier()),
          chatProvider.overrideWith(() => MockChatNotifier()),
        ],
        child: const MaterialApp(
          home: DashboardScreen(),
        ),
      ),
    );

    await tester.pump();

    // Verify title, messages list and inputs
    expect(find.text("Wellness"), findsOneWidget);
    expect(find.text("Hello, Mock User"), findsOneWidget);
    expect(find.text("Hello! I am mock Wellness."), findsOneWidget);
    expect(find.text("Hello AI!"), findsOneWidget);
    expect(find.text('General guidance · AI unavailable'), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
  });

  testWidgets('HealthProfileScreen widget check', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          profileApiProvider.overrideWithValue(FakeProfileApi()),
        ],
        child: const MaterialApp(
          home: HealthProfileScreen(),
        ),
      ),
    );

    // Wait for the future to load
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    // Verify form fields and labels in the visible viewport are rendered
    expect(find.text("Personalized Vitals"), findsOneWidget);
    expect(find.text("Medical History"), findsOneWidget);
    expect(find.text("Lifestyle Factors"), findsOneWidget);
  });

  testWidgets('HeartRiskScreen widget check', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          riskProvider.overrideWith(() => MockRiskNotifier()),
        ],
        child: const MaterialApp(
          home: HeartRiskScreen(),
        ),
      ),
    );

    await tester.pump();

    // Verify result is displayed (since MockRiskNotifier state has resultScore)
    expect(find.text("Cardiac Risk Evaluator"), findsOneWidget);
    expect(find.text("12.5%"), findsOneWidget);
    expect(find.text("NORMAL RANGE"), findsOneWidget);
    expect(find.text("Engine: fallback clinical matrix"), findsOneWidget);
  });
}
