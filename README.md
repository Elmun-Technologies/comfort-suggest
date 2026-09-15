# 🛋️ Comfort Suggest — Mebel Do'koni uchun Anonim Fikr-Mulohaza Platformasi

Mebel furniturasi va xomashyo mahsulotlari (petlya, relslar, DSP/MDF, stol usti plitalari, qirqish, ombor xizmati va h.k.) sotadigan do'konlar uchun mo'ljallangan **QR-kod orqali 100% anonim** e'tiroz, taklif va shikoyatlar tizimi.

Ushbu loyiha do'kon kiraverishida, kassa peshtaxtasida va omborda o'rnatilgan QR-kodlar orqali ishlaydi. Mebel ustalari smartfoni orqali tezkor kirib, o'z fikrlarini qoldirishadi va barcha ma'lumotlar to'g'ridan-to'g'ri mas'ul rahbarlarning **Telegram guruhiga** yuboriladi.

---

## ✨ Asosiy Imkoniyatlar

1. **📱 100% Mobil va QR-kodga moslashgan:**
   - Hech qanday qo'shimcha planshet yoki qimmatbaho apparat (hardware) talab etilmaydi.
   - Smartfon kamerasini to'g'rilash orqali bir lahzada ochiladi.

2. **🔒 To'liq Anonimlik:**
   - Foydalanuvchidan ism, telefon raqami yoki login talab qilinmaydi.
   - Shaxsiy ma'lumotlar saqlanmaydi va log qilinmaydi. Mijozlar ochiq va xolis fikr bildirishlari mumkin.

3. **🪚 Mebel Sohasi Uchun Moslashtirilgan Bo'limlar:**
   - 🔩 **Furnitura va mexanizmlar** (petlyalar, gazlift, relslar, dastaklar)
   - 🪵 **DSP, MDF va Stol usti plitalari** (laminatsiya, kromka, qirqish)
   - 📦 **Ombor va Yuk ortish** (kutish vaqti, shikastlangan tovarlar)
   - 💰 **Narxlar va chegirmalar** (ulgurji narx, to'lov qulayligi)
   - 👥 **Sotuvchilar va maslahatchilar muomalasi**
   - ⏱️ **Kassa va navbatlar**
   - 🚚 **Yetkazib berish xizmati**

4. **🎙️ Ovozli Xabar (Voice Message) Imkoniyati:**
   - Mebel ustalari shoshayotgan yoki matn yozishni istamagan holatda, bitta tugma bilan 1 daqiqagacha ovoz yozib qoldirishi mumkin. Ovoz ham Telegram guruhga yetkaziladi.

5. **📸 Rasm Biriktirish:**
   - Nuqsonli tovar (brak furnitura, cheti uchgan plita) yoki chek rasmini yuklash.

6. **🖨️ Tayyor QR Plakat Chop Etish Sahifasi (`/poster`):**
   - Do'kon stendiga, kassa oldiga yoki eshikka ilish uchun A4 formatidagi professional dizayn.
   - Bitta "Chop etish" tugmasi orqali to'g'ridan-to'g'ri chop etiladi.

7. **📊 Rahbariyat Monitoring Paneli (`/admin`):**
   - Bo'limlar bo'yicha tahlil, qoniqish indeksi, e'tirozlar foizi.
   - Murojaatlarni "O'rganilmoqda" va "Hal qilindi" holatlariga o'tkazish.

8. **🤖 Telegram Bot Integratsiyasi (`/admin/settings`):**
   - Bot token va Guruh ID sini kiritish hamda bir marta bosish orqali test qilish.

---

## 🚀 Ishga Tushirish

```bash
# Kutubxonalarni o'rnatish
npm install

# Dasturni ishlab chiqish rejimida ishga tushirish
npm run dev

# Ishlab chiqarish (Production) build qilish
npm run build
npm start
```

## ⚙️ Muhit O'zgaruvchilari (Ixtiyoriy)

`.env.local` faylida quyidagilarni ko'rsatishingiz mumkin:
```env
TELEGRAM_BOT_TOKEN="your_bot_token_here"
TELEGRAM_CHAT_ID="-100xxxxxxxxxx"
```
*(Yoki brauzerning o'zida `/admin/settings` sahifasidan kiritishingiz mumkin).*
