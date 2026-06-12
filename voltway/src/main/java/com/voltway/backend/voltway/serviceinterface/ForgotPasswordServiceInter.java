package com.voltway.backend.voltway.serviceinterface;

public interface ForgotPasswordServiceInter {
    boolean sendOtp(String email);  //method for sending OTP
    boolean verifyOtp(String email, String otp, String newPassword); // Verify OTP and reset password
}
