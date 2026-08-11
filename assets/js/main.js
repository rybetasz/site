/* =========================================================
   NEREPL2.COM.TR
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   SAYFA YÜKLENDİĞİNDE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("nerepl2.com.tr hazır.");

    initializePage();

});


/* =========================================================
   SAYFA BAŞLATMA
   ========================================================= */

function initializePage() {

    initializeActiveMenu();

    initializeImageLazyLoading();

    initializeCardAnimations();

    initializeSliders();

    initializeAutoHideNavbar();

}


/* =========================================================
   AKTİF MENÜ
   ========================================================= */

function initializeActiveMenu() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const menuLinks =
        document.querySelectorAll(".main-menu a");


    menuLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href")
                .split("/")
                .pop()
                .toLowerCase();


        if (
            linkPage === currentPage &&
            currentPage !== ""
        ) {

            link.classList.add("active");

        }

    });

}


/* =========================================================
   OTOMATİK GİZLENEN NAVBAR
   (Görev çubuğu tarzı gizlenme/gösterilme)
   ========================================================= */

function initializeAutoHideNavbar() {

    const navbar =
        document.querySelector(".navbar");


    if (!navbar) {

        return;

    }


    /*
     * Bar bu değerin altındayken
     * (sayfanın en üstüne yakınken)
     * hiçbir zaman gizlenmez.
     */

    const revealThreshold = 80;


    let lastScrollY =
        window.scrollY;

    let ticking = false;


    function handleScroll() {

        const currentScrollY =
            window.scrollY;


        if (currentScrollY <= revealThreshold) {

            /*
             * Sayfanın en üstündeyiz,
             * bar her zaman görünsün.
             */

            navbar.classList.remove(
                "navbar-hidden"
            );

        } else if (currentScrollY > lastScrollY) {

            /*
             * Aşağı kaydırılıyor,
             * bar gizlensin.
             */

            navbar.classList.add(
                "navbar-hidden"
            );

        } else if (currentScrollY < lastScrollY) {

            /*
             * Yukarı kaydırılıyor,
             * bar geri gelsin.
             */

            navbar.classList.remove(
                "navbar-hidden"
            );

        }


        lastScrollY = currentScrollY;

        ticking = false;

    }


    window.addEventListener(
        "scroll",
        function () {

            if (!ticking) {

                window.requestAnimationFrame(
                    handleScroll
                );

                ticking = true;

            }

        },
        { passive: true }
    );


    /*
     * Görev çubuğu davranışı:
     * fare ekranın en tepesine
     * yaklaşınca bar geri gelsin.
     */

    document.addEventListener(
        "mousemove",
        function (event) {

            if (event.clientY <= 6) {

                navbar.classList.remove(
                    "navbar-hidden"
                );

            }

        }
    );

}


/* =========================================================
   LAZY IMAGE LOADING
   ========================================================= */

function initializeImageLazyLoading() {

    const images =
        document.querySelectorAll("img");


    images.forEach(function (image) {

        /*
         * Tarayıcının resmi sayfa yüklenirken
         * öncelikli olarak yüklemesini sağlar.
         */

        if (!image.hasAttribute("loading")) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }

    });

}


/* =========================================================
   KART ANİMASYONLARI
   ========================================================= */

function initializeCardAnimations() {

    const cards =
        document.querySelectorAll(
            ".mod-card, .project-card"
        );


    if (!cards.length) {
        return;
    }


    /*
     * Kartlar ekrana girdiğinde
     * hafif animasyon uygulanır.
     */

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "card-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    cards.forEach(function (card) {

        observer.observe(card);

    });

}


/* =========================================================
   SLIDER YARDIMCI SINIFI
========================================================= */

class ImageSlider {

    constructor(element) {

        this.container = element;

        this.imageElement =
            element.querySelector(".slider-image img");

        this.counterElement =
            element.querySelector(".slider-counter");

        this.images =
            element.dataset.images
                .split(",")
                .map(image => image.trim())
                .filter(image => image.length > 0);

        this.interval = 5000;

        this.currentIndex = 0;

        this.timer = null;


        /*
         * Slider elemanı yoksa çık
         */

        if (!this.imageElement) {

            return;

        }


        /*
         * Resim yoksa çık
         */

        if (!this.images.length) {

            return;

        }


        this.initialize();

    }


    /* =====================================================
       BAŞLAT
    ===================================================== */

    initialize() {

        /*
         * İlk resmi göster
         */

        this.imageElement.src =
            this.images[0];


        /*
         * Sayacı güncelle
         */

        this.updateCounter();


        /*
         * Birden fazla resim varsa
         * otomatik geçiş başlat
         */

        if (this.images.length > 1) {

            this.startAutoPlay();

        }

    }


    /* =====================================================
       RESMİ GÜNCELLE
    ===================================================== */

    update() {

        if (!this.imageElement) {

            return;

        }


        /*
         * Geçiş animasyonu
         */

        this.imageElement.style.transition =
            "transform 0.7s ease-in-out";

        this.imageElement.style.transform =
            "translateX(-100%)";


        /*
         * Eski resim çıktıktan sonra
         * yeni resmi yükle
         */

        setTimeout(() => {

            this.imageElement.style.transition =
                "none";

            this.imageElement.style.transform =
                "translateX(100%)";


            this.imageElement.src =
                this.images[this.currentIndex];


            /*
             * Yeni resmi ekrana getir
             */

            setTimeout(() => {

                this.imageElement.style.transition =
                    "transform 0.7s ease-in-out";

                this.imageElement.style.transform =
                    "translateX(0)";

            }, 50);


        }, 700);


        this.updateCounter();

    }


    /* =====================================================
       SAYACI GÜNCELLE
    ===================================================== */

    updateCounter() {

        if (!this.counterElement) {

            return;

        }


        const current =
            String(
                this.currentIndex + 1
            ).padStart(2, "0");


        const total =
            String(
                this.images.length
            ).padStart(2, "0");


        this.counterElement.textContent =
            current + " / " + total;

    }


    /* =====================================================
       SONRAKİ
    ===================================================== */

    next() {

        if (!this.images.length) {

            return;

        }


        this.currentIndex++;


        if (
            this.currentIndex >=
            this.images.length
        ) {

            this.currentIndex = 0;

        }


        this.update();

    }


    /* =====================================================
       ÖNCEKİ
    ===================================================== */

    previous() {

        if (!this.images.length) {

            return;

        }


        this.currentIndex--;


        if (this.currentIndex < 0) {

            this.currentIndex =
                this.images.length - 1;

        }


        this.update();

    }


    /* =====================================================
       OTOMATİK GEÇİŞ
    ===================================================== */

    startAutoPlay() {

        this.stopAutoPlay();


        this.timer =
            setInterval(() => {

                this.next();

            }, this.interval);

    }


    /* =====================================================
       OTOMATİK GEÇİŞİ DURDUR
    ===================================================== */

    stopAutoPlay() {

        if (this.timer) {

            clearInterval(this.timer);

            this.timer = null;

        }

    }

}


/* =========================================================
   MOD SLIDER
========================================================= */

let modSlider = null;


/* =========================================================
   PROJE SLIDER
========================================================= */

let projectSlider = null;


/* =========================================================
   SLIDERLARI BAŞLAT
========================================================= */

function initializeSliders() {

    const sliderElements =
        document.querySelectorAll(
            ".detail-slider[data-slider]"
        );


    /*
     * Sayfada slider yoksa çık
     */

    if (!sliderElements.length) {

        return;

    }


    sliderElements.forEach(function (element) {

        const slider =
            new ImageSlider(element);


        /*
         * MOD
         */

        if (
            element.dataset.slider ===
            "mod"
        ) {

            modSlider = slider;

        }


        /*
         * PROJE
         */

        if (
            element.dataset.slider ===
            "project"
        ) {

            projectSlider = slider;

        }

    });

}


/* =========================================================
   MOD SLIDER BUTONLARI
========================================================= */

function changeModImage(direction) {

    if (!modSlider) {

        return;

    }


    if (direction > 0) {

        modSlider.next();

    } else {

        modSlider.previous();

    }

}


/* =========================================================
   PROJE SLIDER BUTONLARI
========================================================= */

function changeProjectImage(direction) {

    if (!projectSlider) {

        return;

    }


    if (direction > 0) {

        projectSlider.next();

    } else {

        projectSlider.previous();

    }

}


/* =========================================================
   KLAVYE
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
         * SOL OK
         */

        if (event.key === "ArrowLeft") {

            if (modSlider) {

                modSlider.previous();

            }


            if (projectSlider) {

                projectSlider.previous();

            }

        }


        /*
         * SAĞ OK
         */

        if (event.key === "ArrowRight") {

            if (modSlider) {

                modSlider.next();

            }


            if (projectSlider) {

                projectSlider.next();

            }

        }

    }
);

/* =========================================================
   SAYFA GEÇİŞİ
   ========================================================= */

function goToPage(page) {

    if (!page) {

        return;

    }


    window.location.href = page;

}



/* =========================================================
   DIŞARI AKTAR
   ========================================================= */

window.ImageSlider =
    ImageSlider;

window.changeModImage =
    changeModImage;

window.changeProjectImage =
    changeProjectImage;

window.goToPage =
    goToPage;