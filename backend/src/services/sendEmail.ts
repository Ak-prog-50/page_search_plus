// call any third party api for sending e-mails. Can be changed any time later.

function sendEmail(email: string, message: string) {
  console.log(`Sending email to ${email} with message: ${message}`);
}

export { sendEmail };
