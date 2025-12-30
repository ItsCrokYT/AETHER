document.addEventListener('DOMContentLoaded', () => {
    // Datos únicos de proyectos
    const uniqueProjects = [];
    const seenSrcs = new Set();
    document.querySelectorAll('.p-item').forEach(item => {
        const src = item.getAttribute('data-src');
        if (src && !seenSrcs.has(src)) {
            seenSrcs.add(src);
            uniqueProjects.push({
                src: src, title: item.getAttribute('data-title'), desc: item.getAttribute('data-desc')
            });
        }
    });

    const modal = document.getElementById('detail-modal');
    const modalImg = document.getElementById('detail-img');
    const modalBg = document.getElementById('detail-bg');
    const modalTitle = document.getElementById('detail-title');
    const modalDesc = document.getElementById('detail-desc');
    const nextBtn = document.getElementById('modal-next');
    let currentIndex = 0;
    let isAnimating = false;

    function openModal(index) {
        currentIndex = index;
        const p = uniqueProjects[index];
        modalImg.src = p.src;
        if(modalBg) modalBg.style.backgroundImage = `url(${p.src})`;
        modalTitle.innerText = p.title;
        modalDesc.innerText = p.desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Clic en tarjetas
    document.querySelectorAll('.p-item').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            const idx = uniqueProjects.findIndex(p => p.src === src);
            if(idx !== -1) {
                // Animación vuelo
                const rect = item.getBoundingClientRect();
                const fly = document.createElement('div');
                Object.assign(fly.style, {
                    position: 'fixed', top: rect.top+'px', left: rect.left+'px',
                    width: rect.width+'px', height: rect.height+'px',
                    backgroundImage: `url(${src})`, backgroundSize: 'cover',
                    zIndex: 9999, transition: 'all 0.6s cubic-bezier(0.7,0,0.3,1)', borderRadius: '8px'
                });
                document.body.appendChild(fly);
                void fly.offsetWidth; // Reflow
                Object.assign(fly.style, { top: 0, left: 0, width: '100vw', height: '100vh', opacity: 0 });
                
                setTimeout(() => {
                    openModal(idx);
                    fly.remove();
                }, 400);
            }
        });
    });

    // Botón Siguiente
    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            if(isAnimating) return;
            isAnimating = true;
            
            // Salida
            [modalImg, modalTitle, modalDesc].forEach(el => {
                el.classList.remove('slide-in-blur');
                el.classList.add('slide-out-blur');
            });

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % uniqueProjects.length;
                const p = uniqueProjects[currentIndex];
                
                modalImg.src = p.src;
                if(modalBg) modalBg.style.backgroundImage = `url(${p.src})`;
                modalTitle.innerText = p.title;
                modalDesc.innerText = p.desc;

                // Entrada
                [modalImg, modalTitle, modalDesc].forEach(el => {
                    el.classList.remove('slide-out-blur');
                    void el.offsetWidth;
                    el.classList.add('slide-in-blur');
                });
                isAnimating = false;
            }, 500);
        });
    }

    document.getElementById('close-detail').onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
});