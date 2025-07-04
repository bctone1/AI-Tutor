const tabs = document.querySelectorAll('.screen-tab');
const screens = document.querySelectorAll('.screen-content');

tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const targetScreen = this.getAttribute('data-screen');

        // 모든 탭 비활성화
        tabs.forEach(t => {
            t.classList.remove('active');
            t.style.backgroundColor = '#f8fafc';
            t.style.color = '#6b7280';
        });

        // 현재 탭 활성화
        this.classList.add('active');
        this.style.backgroundColor = '#4f46e5';
        this.style.color = 'white';

        // 모든 화면 숨기기
        screens.forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });

        // 선택된 화면 보이기
        const targetElement = document.getElementById('screen-' + targetScreen);
        if (targetElement) {
            targetElement.style.display = 'block';
            targetElement.classList.add('active');
        }
    });
});

// RAG 시스템 내부 탭 전환 기능
const ragTabs = document.querySelectorAll('.rag-tab');
const ragContents = document.querySelectorAll('.rag-content');

ragTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const isProblems = this.id === 'rag-tab-problems';

        // 모든 RAG 탭 비활성화
        ragTabs.forEach(t => {
            t.classList.remove('active');
            t.style.backgroundColor = 'transparent';
            t.style.color = '#6b7280';
            t.style.borderBottom = 'none';
        });

        // 현재 RAG 탭 활성화
        this.classList.add('active');
        this.style.backgroundColor = '#f8fafc';
        this.style.color = '#4f46e5';
        this.style.borderBottom = '2px solid #4f46e5';

        // 모든 RAG 컨텐츠 숨기기
        ragContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // 선택된 RAG 컨텐츠 보이기
        const targetContent = isProblems ?
            document.getElementById('rag-content-problems') :
            document.getElementById('rag-content-reference');

        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
        }
    });
});
