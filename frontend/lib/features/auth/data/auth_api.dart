import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import 'models/user_model.dart';
import 'models/token_model.dart';

class AuthApi {
  final Dio _dio;

  AuthApi(this._dio);

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final res = await _dio.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
    });
    return UserModel.fromJson(res.data as Map<String, dynamic>);
  }

  Future<TokenModel> login({
    required String email,
    required String password,
  }) async {
    final res = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return TokenModel.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> logout() async {
    await _dio.post('/auth/logout');
  }

  Future<String> forgotPassword(String email) async {
    final response = await _dio.post('/auth/forgot-password', data: {'email': email});
    return response.data['message'] as String;
  }

  Future<void> resetPassword({
    required String email,
    required String token,
    required String password,
    required String confirmation,
  }) async {
    await _dio.post('/auth/reset-password', data: {
      'email': email,
      'token': token,
      'newPassword': password,
      'confirmPassword': confirmation,
    });
  }

  Future<bool> checkEmail(String email) async {
    final res = await _dio.get('/auth/check-email', queryParameters: {'email': email});
    return res.data['exists'] as bool? ?? false;
  }
}

final authApiProvider = Provider<AuthApi>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthApi(dio);
});
