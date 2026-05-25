# Прайм Моторс — лендинг

Одностраничный сайт официального дилера VOYAH и EVOLUTE в Вологде.

## Запуск

Откройте `index.html` в браузере или запустите локальный сервер:

```bash
cd "/Users/server/Desktop/лера"
python3 -m http.server 8080
```

Сайт: http://localhost:8080

## Изображения

Изображения с официальных сайтов дилеров:

- VOYAH: [voyah-autoprodix-spb.ru](https://voyah-autoprodix-spb.ru/) — hero, салон, авто, тест-драйв, иконки
- EVOLUTE: [evolute-autopark.ru](https://evolute-autopark.ru/) — логотип, i-SPACE, баннеры

Контакты: +7 (8172) 78-62-12, Вологда, Северная 25Б.

Референс вашего макета: `assets/hero-reference.png`.

## Настройка

- Телефон и адрес: `index.html`, блок `.header__contacts` и `#contacts`
- Карта: iframe в секции контактов (координаты Яндекс.Карт)
- Форма: сейчас показывает сообщение об успехе; подключите CRM или почту в `js/main.js`
