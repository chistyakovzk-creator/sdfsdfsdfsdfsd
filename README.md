# Прайм Моторс — лендинг

Одностраничный сайт официального дилера VOYAH и EVOLUTE в Вологде.

## Запуск

Откройте `index.html` в браузере или запустите локальный сервер:

```bash
cd "/Users/server/Desktop/лера"
python3 -m http.server 8080
```

Сайт: http://localhost:8080

## Публикация для заказчика (бесплатно)

Сайт лежит в GitHub и публикуется через **GitHub Pages** (бесплатный HTTPS-хостинг).

**Адрес после публикации:**

`https://chistyakovzk-creator.github.io/sdfsdfsdfsdfsd/`

**Один раз включить Pages** (если по ссылке 404):

1. Репозиторий: https://github.com/chistyakovzk-creator/sdfsdfsdfsdfsd  
2. **Settings** → **Pages**  
3. **Build and deployment** → Source: **Deploy from a branch**  
4. Branch: **main**, папка **/ (root)** → **Save**  
5. Подождите 1–3 минуты — появится зелёная ссылка на сайт.

Альтернатива: Source **GitHub Actions** — тогда сработает workflow `.github/workflows/deploy-pages.yml`.

Обновление на хостинге: `git add -A && git commit -m "..." && git push origin main`.

## Изображения

Изображения с официальных сайтов дилеров:

- VOYAH: [voyah-autoprodix-spb.ru](https://voyah-autoprodix-spb.ru/) — hero, салон, авто, тест-драйв, иконки
- EVOLUTE: [evolute-autopark.ru](https://evolute-autopark.ru/) — логотип, i-SPACE, баннеры

Контакты: ресепшн +7 (8172) 78-62-20, Вологда, Северная 25Б. Полный список телефонов — в `#contacts`.

Референс вашего макета: `assets/hero-reference.png`.

## Настройка

- Телефон и адрес: `index.html`, блок `.header__contacts` и `#contacts`
- Карта: iframe в секции контактов (координаты Яндекс.Карт)
- Форма: сейчас показывает сообщение об успехе; подключите CRM или почту в `js/main.js`
