import 'package:flutter/material.dart';
import '../features/landing/presentation/landing_screen.dart';
import '../features/auth/presentation/auth_screen.dart';
import '../features/auth/presentation/password_recovery_screen.dart';
import '../features/chat/presentation/dashboard_screen.dart';
import '../features/profile/presentation/health_profile_screen.dart';
import '../features/risk/presentation/heart_risk_screen.dart';
import '../features/specialist/presentation/specialist_screen.dart';
import '../features/contact/presentation/contact_screen.dart';

class AppRouter {
  static const String landing = '/';
  static const String auth = '/auth';
  static const String dashboard = '/dashboard';
  static const String profile = '/profile';
  static const String risk = '/risk';
  static const String specialist = '/specialist';
  static const String contact = '/contact';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    final uri = Uri.tryParse(settings.name ?? '/');
    switch (uri?.path) {
      case '/forgot-password':
        return MaterialPageRoute(settings: settings, builder: (_) => const PasswordRecoveryScreen());
      case '/reset-password':
        return MaterialPageRoute(settings: settings, builder: (_) => PasswordRecoveryScreen(
          isReset: true, token: uri?.queryParameters['token'], email: uri?.queryParameters['email']));
      case landing:
        return MaterialPageRoute(builder: (_) => const LandingScreen());
      case auth:
        return MaterialPageRoute(builder: (_) => const AuthScreen());
      case dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case profile:
        return MaterialPageRoute(builder: (_) => const HealthProfileScreen());
      case risk:
        return MaterialPageRoute(builder: (_) => const HeartRiskScreen());
      case specialist:
        return MaterialPageRoute(builder: (_) => const SpecialistScreen());
      case contact:
        return MaterialPageRoute(builder: (_) => const ContactScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
