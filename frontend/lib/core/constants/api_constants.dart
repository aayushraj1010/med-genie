import 'package:flutter/foundation.dart';

class ApiConstants {
  static String get baseUrl {
    const configuredUrl = String.fromEnvironment('API_BASE_URL');
    if (configuredUrl.isNotEmpty) {
      return configuredUrl.replaceFirst(RegExp(r'/+$'), '');
    }
    if (kIsWeb) {
      return 'http://127.0.0.1:9005/api';
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:9005/api';
    }
    return 'http://127.0.0.1:9005/api';
  }
}

