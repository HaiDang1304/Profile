import { useState } from 'react';
import { profileConfig } from '../../config/profileConfig';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error' | 'no_endpoint'
  const [statusMessage, setStatusMessage] = useState('');

  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

  const validate = () => {
    const nextErrors = {};

    // Name validation: 2 - 80 chars
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      nextErrors.name = 'Vui lòng nhập họ và tên của bạn.';
    } else if (trimmedName.length < 2 || trimmedName.length > 80) {
      nextErrors.name = 'Họ và tên phải từ 2 đến 80 ký tự.';
    }

    // Email validation: standard email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(trimmedEmail)) {
      nextErrors.email = 'Địa chỉ email không hợp lệ (ví dụ: name@domain.com).';
    }

    // Subject validation: 3 - 120 chars
    const trimmedSubject = formData.subject.trim();
    if (!trimmedSubject) {
      nextErrors.subject = 'Vui lòng nhập tiêu đề lời nhắn.';
    } else if (trimmedSubject.length < 3 || trimmedSubject.length > 120) {
      nextErrors.subject = 'Tiêu đề phải từ 3 đến 120 ký tự.';
    }

    // Message validation: 10 - 2000 chars
    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      nextErrors.message = 'Vui lòng nhập nội dung tin nhắn.';
    } else if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
      nextErrors.message = 'Nội dung tin nhắn phải từ 10 đến 2000 ký tự.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // If endpoint is not configured in environment, do not fake success
    if (!endpoint) {
      setSubmitStatus('no_endpoint');
      setStatusMessage(
        `Chưa cấu hình API endpoint (VITE_CONTACT_ENDPOINT). Bạn vui lòng gửi thư trực tiếp qua email: ${profileConfig.email}`
      );
      return;
    }

    setSubmitStatus('submitting');
    setStatusMessage('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage('Lời nhắn của bạn đã được gửi thành công! Mình sẽ phản hồi sớm nhất có thể.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMessage('Không thể gửi tin nhắn qua server. Vui lòng liên hệ trực tiếp qua email.');
      }
    } catch {
      setSubmitStatus('error');
      setStatusMessage('Đã xảy ra lỗi kết nối mạng. Vui lòng thử lại sau hoặc gửi email.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form font-sans text-xs select-text">
      {/* Name Field */}
      <div>
        <label htmlFor="contact-name" className="block text-slate-300 font-bold mb-1.5">
          Họ và tên <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          aria-invalid={Boolean(errors.name)}
          placeholder="Nguyễn Văn A"
          className={`w-full px-3.5 py-2.5 bg-slate-900/90 text-white rounded-lg border focus:outline-none transition-colors ${
            errors.name ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
          }`}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-red-400 text-[11px] mt-1">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="contact-email" className="block text-slate-300 font-bold mb-1.5">
          Email liên hệ <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={formData.email}
          onChange={handleChange}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          aria-invalid={Boolean(errors.email)}
          placeholder="your.email@example.com"
          className={`w-full px-3.5 py-2.5 bg-slate-900/90 text-white rounded-lg border focus:outline-none transition-colors ${
            errors.email ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
          }`}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-red-400 text-[11px] mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="contact-subject" className="block text-slate-300 font-bold mb-1.5">
          Tiêu đề <span className="text-red-400">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          autoComplete="off"
          required
          value={formData.subject}
          onChange={handleChange}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          aria-invalid={Boolean(errors.subject)}
          placeholder="Hợp tác dự án Web / IoT"
          className={`w-full px-3.5 py-2.5 bg-slate-900/90 text-white rounded-lg border focus:outline-none transition-colors ${
            errors.subject ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
          }`}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="text-red-400 text-[11px] mt-1">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Content Field */}
      <div>
        <label htmlFor="contact-message" className="block text-slate-300 font-bold mb-1.5">
          Nội dung tin nhắn <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={Boolean(errors.message)}
          placeholder="Mô tả chi tiết dự án, ý tưởng hoặc lời chào..."
          className={`w-full px-3.5 py-2.5 bg-slate-900/90 text-white rounded-lg border focus:outline-none transition-colors resize-none ${
            errors.message ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
          }`}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-red-400 text-[11px] mt-1">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button (Minimum 44px touch height) */}
      <button
        type="submit"
        disabled={submitStatus === 'submitting'}
        className="w-full min-h-[44px] px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {submitStatus === 'submitting' ? 'Đang gửi lời nhắn...' : 'Gửi lời nhắn →'}
      </button>

      {/* Feedback Status Notice */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`p-3 rounded-lg border text-xs leading-relaxed ${
            submitStatus === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
              : submitStatus === 'no_endpoint'
              ? 'bg-amber-950/80 border-amber-500/80 text-amber-200'
              : 'bg-red-950/80 border-red-500/80 text-red-300'
          }`}
        >
          {statusMessage}
        </div>
      )}
    </form>
  );
}
