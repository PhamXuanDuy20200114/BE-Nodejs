import nodemailer from 'nodemailer';
require('dotenv').config();

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Đại ka Gấu Gấu 👻" <maddison53@ethereal.email>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyEmail(dataSend.language, dataSend), // html body
    });

}

const getBodyEmail = (language, dataSend) => {
    if (language === 'vi') {
        return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Đại ka Gấu Gấu</p>
        <p>Thông tin lịch hẹn của bạn như sau:</p>
        <div><b>Thời gian khám:</b> ${dataSend.timeString}</div>
        <div><b>Bác sĩ:</b> ${dataSend.doctorName}</div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng bấm vào link bên dưới để hoàn tất đặt lịch khám bệnh.</p>
        <div><a href="${dataSend.redirectLink}">Xác nhận đặt lịch</a></div>

        <p>Trân trọng cảm ơn!</p>
        `
    }
    return `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked a medical appointment online at Đại ka Gấu Gấu</p>
        <p>Your appointment details are as follows:</p>
        <div><b>Appointment time:</b> ${dataSend.timeString}</div>
        <div><b>Doctor:</b> ${dataSend.doctorName}</div>
        <p>If the above information is correct, please click the link below to confirm your appointment.</p>
        <div><a href="${dataSend.redirectLink}">Confirm Appointment</a></div>
        <p>Thank you very much!</p>
        `
}

const sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Đại ka Gấu Gấu 👻" <maddison53@ethereal.email>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getBodyEmailRemedy(dataSend.language, dataSend), // html body
        attachments: [
            {
                filename: 'remedy.pdf',
                content: dataSend.imageBase64.split('base64,')[1],
                encoding: 'base64',
            }]
    });

}

const getBodyEmailRemedy = (language, dataSend) => {
    if (language === 'vi') {
        return `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Đại ka Gấu Gấu thành công.</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>
        <p>Trân trọng cảm ơn!</p>
        `
    } else {
        return `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You are receiving this email because you have successfully booked an online medical examination appointment on Dai ka Gau Gau.</p>
        <p>Prescription/invoice information is sent in the attached file.</p>
        <p>Thank you very much!</p>
        `
    }
}


module.exports = {
    sendSimpleEmail,
    sendAttachment
}