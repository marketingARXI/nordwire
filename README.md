# NordWire - Industrial Monitoring

Website institucional bilingue da NordWire, dedicado a tecnologia de monitorização industrial. A NordWire desenvolve a tecnologia e trabalha com parceiros que a implementam no cliente final.

## Tecnologia

- HTML5 sem framework
- CSS responsivo com tokens de design partilhados
- JavaScript vanilla para navegação, internacionalização e interações
- `<model-viewer>` para o modelo 3D de prototipagem

## Estrutura

```text
.
├── index.html
├── hardware.html
├── nordgo.html
├── como-funciona.html
├── integracoes.html
├── seguranca.html
├── beneficios-parceiros.html
├── beneficios-fabricas.html
├── prototipagem.html
├── sobre-nos.html
├── parceria.html
├── contactos.html
└── assets/
    ├── css/
    │   ├── styles.css
    │   └── partners-modal.css
    ├── images/
    ├── js/
    │   ├── header.js
    │   ├── script.js
    │   └── partners-modal.js
    ├── models/
    └── videos/
```

O cabeçalho, o rodapé e o sistema PT/EN são partilhados através de `assets/js/header.js`. As páginas internas contêm por agora apenas o esqueleto e conteúdo de preparação.

## Executar localmente

O projeto é estático. Pode ser aberto diretamente ou servido por um servidor HTTP local:

```bash
python -m http.server 8000
```

Depois, abrir `http://localhost:8000`.
