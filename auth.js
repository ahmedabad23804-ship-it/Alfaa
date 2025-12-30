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
 * دالة التحقق من الصلاحيات والحظر (Core Security)
 * تعمل بشكل تلقائي في كل الصفحات وتراقب الحالة لحظياً
 */
function checkAuth() {
    const code = localStorage.getItem('alpha_user_code');
    
    // تحديد اسم الصفحة الحالية
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);
    
    // الصفحات الخاصة
    const isLoginPage = (pageName === 'index.html' || pageName === '' || pageName === '/');
    const isBlockedPage = (pageName === 'blocked.html');

    // 1. حالة عدم وجود كود مسجل (لم يسجل دخول)
    if (!code) {
        if (!isLoginPage) {
            window.location.replace('index.html');
        }
        return null;
    }

    // 2. التحقق الأمني من قاعدة البيانات (Real-time Listener)
    if (typeof firebase !== 'undefined') {
        const db = firebase.database();
        
        // استخدام .on لمراقبة أي تغيير يفعله الأدمن لحظياً
        db.ref('approvedStudents/' + code).on('value', (snapshot) => {
            const user = snapshot.val();

            // أ: الكود غير موجود في قاعدة البيانات (تم حذفه من الأدمن)
            if (!user) {
                localStorage.clear();
                window.location.replace('index.html');
                return;
            }

            // ب: التحقق من الحظر
            if (user.isBlocked === true) {
                // حفظ الاسم لعرضه في رسالة الحظر
                localStorage.setItem('studentName', user.studentName);
                
                // لو الطالب مش في صفحة الحظر -> اطرده لصفحة "تم حظرك" فوراً
                if (!isBlockedPage) {
                    window.location.replace('blocked.html');
                }
            } 
            else {
                // ج: الطالب سليم (غير محظور)
                
                // لو كان في صفحة الحظر (وتم فك الحظر عنه الآن)
                if (isBlockedPage) {
                    alert("تم فك الحظر، نورت يا بطل! 😉");
                    window.location.replace('subjects.html');
                }
                
                // لو حاول يدخل صفحة التسجيل وهو مسجل أصلاً -> دخله للمواد
                if (isLoginPage) {
                    window.location.replace('subjects.html');
                }
            }
        });
    }

    return code;
}

/**
 * دالة تسجيل الخروج
 */
function logout() {
    if(confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // مسح كود الدخول والبيانات المؤقتة
        localStorage.removeItem('alpha_user_code');
        localStorage.removeItem('studentName');
        localStorage.removeItem('activeLecture');
        
        // ملاحظة: لا نمسح بصمة الجهاز (Device ID) لمنع التحايل
        // localStorage.removeItem('FULLMARK_DEVICE_ID'); 
        
        // توجيه فوري لصفحة الدخول
        window.location.replace('index.html');
    }
}

// تشغيل نظام الحماية تلقائياً عند تحميل الملف
checkAuth();
