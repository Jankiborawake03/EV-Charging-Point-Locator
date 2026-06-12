package com.voltway.backend.voltway.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;


    public void sendEmail (String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("voltwayev@gmail.com");

        mailSender.send(message);
    }


    public void sendWelcomeEmail (String toEmail, String name) {
        String subject = "Welcome to VoltWay EV Charging Station!";
        String text = "Dear " + name + ",\n\n"
                + "Welcome to VoltWay! 🚗⚡\n\n"
                + "We're thrilled to have you onboard. Now you can easily locate and use EV charging stations.\n\n"
                + "If you have any questions, feel free to contact us.\n\n"
                + "Best Regards,\nVoltWay Team";

        sendEmail(toEmail, subject, text);
    }
}




