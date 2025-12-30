// 🔐 ALPHA SECURITY SYSTEM - FULLMARK 2025
// نظام التحقق والحماية وإدارة الجلسات

const firebaseConfig = {
    apiKey: "AIzaSyD1QB3qaFfkGYq0OWOEAr83V25NAPFwxzs",
    authDomain: "fullmark-2025.firebaseapp.com",
    databaseURL: "https://fullmark-2025-default-rtdb.firebaseio.com",
    projectId: "fullmark-2025",
    storageBucket: "fullmark-2025.firebasestorage.app",
    messagingSenderId: "963956202032",
    appId: "1:963956202032:web:4df914457d79b75dee2bf5"
};

// تهيئة الفايربيس (تمنع تكرار التشغيل وتضمن استقرار الربط)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

/**
 * دالة التحقق من الدخول
 * تستخدم في بداية كل صفحة (ماعدا صفحة الدخول)
 */
function checkAuth() {
    const code = localStorage.getItem('alpha_user_code');
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    // إذا لم يوجد كود والمستخدم ليس في صفحة الدخول
    if (!code && !isLoginPage) {
        window.location.replace('index.html'); // استخدام replace لمنع الرجوع للخلف
        return null;
    }
    
    // إذا وجد الكود والمستخدم يحاول دخول صفحة الدخول (اختياري: توجيهه للرئيسية)
    if (code && isLoginPage) {
        // window.location.href = 'dashboard.html'; // يمكنك تفعيلها إذا أردت
    }

    return code;
}

/**
 * دالة تسجيل الخروج
 */
function logout() {
    if(confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // مسح كود الدخول
        localStorage.removeItem('alpha_user_code');
        // توجيه فوري لصفحة الدخول
        window.location.replace('index.html');
    }
}

// تشغيل الفحص تلقائياً عند تحميل السكريبت
checkAuth();
