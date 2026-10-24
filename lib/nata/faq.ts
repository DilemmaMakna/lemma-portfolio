export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Apakah Nataku gratis digunakan?',
    answer:
      "Fitur dasar di aplikasi Android seperti Today's Focus dan hitung mundur tugas bisa kamu pakai secara gratis. Namun, asisten harian WhatsApp dan pencatatan via chat adalah fitur unggulan di tier On Track yang berbayar. Pengguna awal akan mendapatkan kuota uji coba gratis untuk fitur WhatsApp ini."
  },
  {
    question: 'Apakah WhatsApp aman dan tidak akan spam?',
    answer:
      'Nomor kamu 100% aman. Nataku hanya mengirimkan pesan sesuai jadwal yang kamu tentukan sendiri. Kami tidak pernah membagikan data nomor pribadimu, dan kamu bisa menghentikan pesan kapan saja cukup dengan mengetik kata "stop".'
  },
  {
    question: 'Kapan aplikasinya bisa mulai saya unduh?',
    answer:
      'Pengujian awal untuk pengguna Android dimulai beberapa minggu ke depan. Hubungi kami lewat WhatsApp resmi untuk menerima tautan instalasi privat pertama kali.'
  },
  {
    question: 'Bagaimana kalau saya pengguna iPhone (iOS)?',
    answer:
      'Fokus peluncuran perdana kami adalah pengguna Android. Hubungi kami lewat WhatsApp agar menjadi orang pertama yang kami kabari saat versi iOS siap dirilis.'
  }
];
