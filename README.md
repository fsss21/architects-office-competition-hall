**02.07 Конкурсный зал (универсальный каталог)**

Приложение для интерактивного каталога конкурсных проектов архитектурного офиса. Включает главное меню, каталог с фильтрацией, карточки проектов и сбор статистики.

## Технологии

- **Frontend:** React 18, Vite, React Router, MUI (Material UI), Emotion
- **Backend:** Express, Node.js
- **Сборка:** Vite, pkg (для standalone-исполняемых файлов)

## Установка

```bash
npm install
```

## Разработка

```bash
# Запуск фронтенда в режиме разработки
npm run dev

# Запуск сервера (отдельно)
npm run server
```

## Сборка и запуск

```bash
# Сборка фронтенда
npm run build

# Предпросмотр собранного приложения
npm run preview
```

### Standalone-приложение

Сборка в исполняемый файл для Windows или macOS:

```bash
# Windows (launch.exe в папке build/)
npm run build:win

# macOS
npm run build:mac
```

## Структура проекта

```
├── src/
│   ├── components/      # Компоненты (Header, VideoPreview и др.)
│   ├── context/         # React Context (фильтры каталога)
│   ├── pages/           # Страницы: MainMenu, Catalog, CatalogItem
│   ├── assets/          # Изображения и статика
│   └── server/          # Express-сервер и API
├── public/              # Публичные файлы (data/, favicon)
└── build/               # Результат сборки
```

## Основные функции

- **Главное меню** — переход в каталог, статистика, оценить проекты
- **Каталог** — список проектов с пагинацией, фильтрами, поддержка 4K
- **Карточка проекта** — детальная информация о проекте
- **API** — CRUD для предметов (`/api/items`), сбор статистики (`/api/statistics`)
