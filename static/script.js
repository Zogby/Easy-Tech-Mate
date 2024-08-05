$(document).ready(function () {
    function showLoading() {
        const lang = $('#toggle-lang-btn').text() === 'E' ? 'English' : 'Arabic';
        const message = lang === 'English'
            ? 'Fetching, analyzing, and organizing information automatically. Do not press anything, I will disappear once my task is done. ⏳'
            : 'جاري البحث وتحليل وتنظيم المعلومات بشكل تلقائي. لا تضغط شيئًا، سأختفي وحدي عند انتهاء مهمتي. ⏳';
        $('#loading-message').text(message);
        $('#loading-overlay').show();
    }

    function hideLoading() {
        $('#loading-overlay').hide();
    }

    function generateDescription() {
        const productName = $('#product_name').val();
        const language = $('#language').val();

        showLoading(); // إظهار نافذة التحميل

        $.ajax({
            type: 'POST',
            url: '/generate',
            contentType: 'application/json',
            data: JSON.stringify({ product_name: productName, language: language, with_emojis: true }),
            success: function (response) {
                $('#output_with_emojis').text(response.description);
                $('#output_without_emojis').text(removeEmojis(response.description));
                hideLoading(); // إخفاء نافذة التحميل عند نجاح الطلب
            },
            error: function () {
                hideLoading(); // إخفاء نافذة التحميل عند فشل الطلب
                alert('حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
            }
        });
    }

    $('#product-form').on('submit', function (e) {
        e.preventDefault();
        generateDescription();
    });

    $('#copy_with_emojis').on('click', function () {
        copyToClipboard('#output_with_emojis');
    });

    $('#copy_without_emojis').on('click', function () {
        copyToClipboard('#output_without_emojis');
    });

    $('#edit-footer-btn').on('click', function () {
        openModal('#footer-modal');
    });

    $('#update-api-key-btn').on('click', function () {
        openModal('#api-key-modal');
    });

    $('#about-btn').on('click', function () {
        openModal('#about-modal');
    });

    $('#toggle-lang-btn').on('click', function () {
        toggleLanguage();
    });

    $('#increase-font-btn').on('click', function () {
        $('#about_text').toggleClass('large-text');
        $('.modal-content').scrollTop(0); // Scroll to top to ensure all text is visible
    });

    $('.close').on('click', function () {
        closeModal($(this).closest('.modal'));
    });

    $('#save-footer-btn').on('click', function () {
        const newFooter = $('#footer-text').val();
        $.post('/update_footer', { footer: newFooter }, function () {
            alert('Footer updated successfully');
            closeModal('#footer-modal');
        });
    });

    $('#save-api-key-btn').on('click', function () {
        const newApiKey = $('#api-key-input').val();
        $.post('/update_api_key', { api_key: newApiKey }, function () {
            alert('API key updated successfully');
            closeModal('#api-key-modal');
        });
    });

    function removeEmojis(text) {
        // استخدام تعبير منتظم للتأكد من إزالة الإيموجي فقط دون التأثير على النصوص الأخرى
        return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // الوجوه التعبيرية
                   .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // الرموز والأشكال
                   .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // النقل والأماكن
                   .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // الرموز الأخرى
                   .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // الرموز المتنوعة
                   .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // الرموز التكميلية
                   .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // الوجوه التعبيرية المتنوعة
                   .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // الرموز الأخرى
                   .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // الرموز المتنوعة الأخرى
                   .replace(/[\u{2600}-\u{26FF}]/gu, '') // الرموز الأخرى
                   .replace(/[\u{2700}-\u{27BF}]/gu, ''); // الرموز المختلفة
    }

    function copyToClipboard(element) {
        const $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val($(element).text()).select();
        document.execCommand('copy');
        $temp.remove();
    }

    function openModal(modal) {
        $(modal).css('display', 'block');
    }

    function closeModal(modal) {
        $(modal).css('display', 'none');
    }

    function toggleLanguage() {
        const currentLang = $('#toggle-lang-btn').text();
        const newLang = currentLang === 'E' ? 'ع' : 'E';
        $('#toggle-lang-btn').text(newLang);
        updateLabels(newLang);
    }

    function updateLabels(lang) {
        if (lang === 'E') {
            $('#product_name_label').text('Enter Product Name:');
            $('#language_label').text('Language:');
            $('#submit_btn').text('Submit');
            $('#output_with_emojis_label').text('Output with Emojis');
            $('#output_without_emojis_label').text('Output without Emojis');
            $('#copy_with_emojis').text('Copy with Emojis');
            $('#copy_without_emojis').text('Copy without Emojis');
            $('#edit-footer-btn').text('Edit Footer');
            $('#update-api-key-btn').text('Update API Key');
            $('#about-btn').text('About');
            $('#edit_footer_label').text('Edit Footer');
            $('#update_api_key_label').text('Update API Key');
            $('#about_label').text('About');
            $('#about_title').text('Easy Tech Mate');
            $('#about_text').html(`
                Easy Tech Mate is a web tool designed to facilitate the process of explaining products to employees and saving them time by providing concise and accurate descriptions of products, with the option to include emojis in the texts. 🌟🤖 The program features: <br><br>
                📌 Enter Product Data: Users can enter the product name and select the language of the description (Arabic or English). <br><br>
                ⚙️ Generate Description: The program generates a concise description of the product based on the entered data, with the option to include emojis. <br><br>
                📝 Display Texts: The generated texts are displayed in separate preview boxes, one with emojis and one without emojis. <br><br>
                📋 Copy Texts: Users can easily copy the texts using the available copy buttons. <br><br>
                ✏️ Edit Footer and API Key: The program provides pop-up windows to edit the footer and update the API key. <br><br>
                🌐 Toggle Language: Users can easily switch the menu language between Arabic and English. <br><br>
                ℹ️ About Window: Contains information about the program and the development team. <br><br>
                The program is fully supported by artificial intelligence and designed to be easy to use and modern in appearance, helping to improve work efficiency and save time in explaining products.
            `);
        } else {
            $('#product_name_label').text('أدخل اسم المنتج:');
            $('#language_label').text('اللغة:');
            $('#submit_btn').text('إرسال');
            $('#output_with_emojis_label').text('الناتج مع الإيموجي');
            $('#output_without_emojis_label').text('الناتج بدون إيموجي');
            $('#copy_with_emojis').text('نسخ مع الإيموجي');
            $('#copy_without_emojis').text('نسخ بدون إيموجي');
            $('#edit-footer-btn').text('تعديل التذييل');
            $('#update-api-key-btn').text('تحديث مفتاح API');
            $('#about-btn').text('حول');
            $('#edit_footer_label').text('تعديل التذييل');
            $('#update_api_key_label').text('تحديث مفتاح API');
            $('#about_label').text('حول');
            $('#about_title').text('Easy Tech Mate');
            $('#about_text').html(`
                Easy Tech Mate هو أداة ويب تهدف إلى تسهيل عملية شرح المنتجات للموظفين وتوفير الوقت عليهم من خلال تقديم وصف مختصر ودقيق للمنتجات، مع إمكانية تضمين الإيموجي في النصوص. 🌟🤖 يتميز البرنامج بما يلي: <br><br>
                📌 إدخال بيانات المنتج: يمكن للمستخدمين إدخال اسم المنتج واختيار لغة الشرح (العربية أو الإنجليزية). <br><br>
                ⚙️ توليد الوصف: يقوم البرنامج بتوليد وصف مختصر للمنتج بناءً على البيانات المدخلة، مع إمكانية تضمين الإيموجي. <br><br>
                📝 عرض النصوص: يتم عرض النصوص الناتجة في مربعات معاينة منفصلة، واحدة تحتوي على الإيموجي وأخرى بدون الإيموجي. <br><br>
                📋 نسخ النصوص: يمكن للمستخدمين نسخ النصوص بسهولة باستخدام أزرار النسخ المتاحة. <br><br>
                ✏️ تحرير التذييل ومفتاح API: يوفر البرنامج نوافذ منبثقة لتحرير التذييل وتحديث مفتاح API. <br><br>
                🌐 تحويل اللغة: يمكن للمستخدمين تبديل لغة القوائم بين العربية والإنجليزية بسهولة. <br><br>
                ℹ️ نافذة حول: تحتوي على معلومات حول البرنامج وفريق التطوير. <br><br>
                البرنامج مدعوم بالذكاء الاصطناعي الكامل ومصمم ليكون سهل الاستخدام وذو واجهة عصرية، مما يساعد في تحسين كفاءة العمل وتوفير الوقت في شرح المنتجات.
            `);
        }
    }

    // Initialize with the correct language
    const initialLanguage = 'English';
    $('#language').val(initialLanguage);
    $('#toggle-lang-btn').text('E');
    updateLabels('E'); // Ensure "About" section is in the correct language

    // Play startup sound
    const audio = new Audio('/static/startup_sound.wav');
    audio.play();
});
