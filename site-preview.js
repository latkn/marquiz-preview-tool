class SitePreview {
    constructor(containerId = 'sitePreviewContainer') {
        this.createElements(containerId);
        this.setupEventListeners();
        this.loadLastSite();
    }

    createElements(containerId) {
        // Create container if it doesn't exist
        this.container = document.getElementById(containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = containerId;
            document.body.appendChild(this.container);
        }

        // Add required styles
        const style = document.createElement('style');
        style.textContent = `
            .url-input-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                transition: opacity 0.3s ease;
            }

            .url-input-container.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .url-input {
                width: 400px;
                padding: 10px;
                font-size: 16px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 10px;
            }

            .load-button {
                padding: 10px 20px;
                background: #d34085;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .load-button:hover {
                background: #c03377;
            }

            .load-button:disabled {
                background: #ccc;
                cursor: not-allowed;
            }

            .loading {
                display: none;
                margin-left: 10px;
            }

            .loading.visible {
                display: inline;
            }

            .preview-frame {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                z-index: -1; /* Изменяем z-index на отрицательный, чтобы фрейм был позади всех элементов */
            }

            .error-message {
                display: none;
                position: fixed;
                top: 60%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                text-align: center;
                color: #d34085;
            }

            .reset-button {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.8);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0.3;
                transition: opacity 0.3s ease;
                z-index: 1001;
                display: none;
            }

            .reset-button::before,
            .reset-button::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 2px;
                background: #666;
                top: 50%;
                left: 50%;
            }

            .reset-button::before {
                transform: translate(-50%, -50%) rotate(45deg);
            }

            .reset-button::after {
                transform: translate(-50%, -50%) rotate(-45deg);
            }

            .reset-button:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);

        // Create HTML structure
        this.container.innerHTML = `
            <iframe id="previewFrame" class="preview-frame"></iframe>
            <button id="resetButton" class="reset-button"></button>
            <div class="url-input-container" id="urlContainer">
                <input type="text" class="url-input" placeholder="Введите URL сайта (например, example.com)" id="siteUrl">
                <button class="load-button" id="loadButton">Загрузить</button>
                <span class="loading" id="loading">Загрузка...</span>
            </div>
            <div id="errorMessage" class="error-message">
                Сайт не может быть загружен, так как он блокирует встраивание в iframe.
                <br>
                Попробуйте открыть другой сайт или проверьте правильность введенного URL.
            </div>
        `;

        // Store element references
        this.elements = {
            previewFrame: document.getElementById('previewFrame'),
            urlContainer: document.getElementById('urlContainer'),
            siteUrl: document.getElementById('siteUrl'),
            loadButton: document.getElementById('loadButton'),
            resetButton: document.getElementById('resetButton'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('errorMessage')
        };
    }

    setupEventListeners() {
        this.elements.loadButton.addEventListener('click', () => this.loadSite());
        this.elements.resetButton.addEventListener('click', () => this.resetSite());
        this.elements.siteUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadSite();
            }
        });
    }

    loadSite() {
        let siteUrl = this.elements.siteUrl.value.trim();

        if (!siteUrl) {
            alert('Пожалуйста, введите URL сайта');
            return;
        }

        // Скрываем инпут сразу после начала загрузки
        this.elements.loadButton.disabled = true;
        this.elements.loading.classList.add('visible');
        this.elements.errorMessage.style.display = 'none';
        this.elements.urlContainer.classList.add('hidden');
        this.elements.resetButton.style.display = 'block';

        if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
            siteUrl = 'https://' + siteUrl;
        }

        localStorage.setItem('lastLoadedSite', siteUrl);

        this.elements.previewFrame.onload = () => {
            this.elements.loadButton.disabled = false;
            this.elements.loading.classList.remove('visible');
        };

        this.elements.previewFrame.onerror = () => this.handleLoadError();
        this.elements.previewFrame.src = siteUrl;
    }

    handleLoadError() {
        this.elements.errorMessage.style.display = 'block';
        this.elements.urlContainer.classList.remove('hidden');
        this.elements.resetButton.style.display = 'none';
        this.elements.loadButton.disabled = false;
        this.elements.loading.classList.remove('visible');
    }

    resetSite() {
        this.elements.previewFrame.src = '';
        this.elements.urlContainer.classList.remove('hidden');
        this.elements.resetButton.style.display = 'none';
        this.elements.siteUrl.value = '';
        localStorage.removeItem('lastLoadedSite');
    }

    loadLastSite() {
        const lastLoadedSite = localStorage.getItem('lastLoadedSite');
        if (lastLoadedSite) {
            this.elements.siteUrl.value = lastLoadedSite;
            this.loadSite();
        }
    }
}
