# Проектная работа "Веб-ларек"
Учебный проект по созданию полноценного SPA интернет-магазина
- Стек frontend: HTML, SCSS, TS, Webpack. 
- Стек backend: Express, MongoDB

Опубликованная frontend-часть: https://anydnny.github.io/web-larek-frontend/

## Цель работы
Frontend: 
 - Реализовать весь пользовательский путь по покупке товара (просмотр карточки - добавление в корзину и её редактирование - оформление заказа)
 - Реализация компонентов интерфейса и состояний экранов
 - Реализация модели данных и подключение API
   
Backend:
 - Реализовать express сервер
 - Настройить обработку и логирование запросов,
 - Реализовать авторизацию и регистрацию
 - Реализовать интеграцию и взаимодействие с MongoDB

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Паттерн
Для проектирования применены паттерны MVP (Model-View-Presenter)
## Типы данных
### Интерфейс `IProduct`
Интерфейс карточки продукта, который будет использован для создания класса `Product`, где будет содержаться информация о товаре. Содержит следующие свойства:
- `id: string` - айди продукта
- `description: string` - описание продукта
- `category: string` - категория продукта
- `image: string` - ссылка на изображение продукта
- `price: number | null` - цена продукта
### Интерфейс `IProductResponse`
Будет использован для типизации ответа, получаемого при запросе к серверу. Свойства:
- `total: number` - общее число продуктов
- `items: IProduct[]` - массив продуктов
### Интерфейс `ICartProduct`
Интерфейс для типизации карточки товара в корзине продуктов. Свойства:
- `id: string` - айди продукта
- `title: string` - название товара
- `price: number` - цена товара
### Интерфейс `ICart`
Будет использова для типизации корзины. Свойства:
- `products: ICartProduct[]` - массив добавленных в корзину товаров
- `totalPrice: number | null` - итоговая цена в корзине
### Интерфейс `IShopApi`
Будет использова для реализации класса с запросами к серверу, который будет расширять текущий базовый класс `Api`
- `getCatalog(): Promise<IProduct[]>` - получение стартового каталога товаров
- `getProductById(id: string): Promise<IProduct>` - получение конкретного товара по айди
`- order(order: IOrder): Promise<ICompleteOrder>` - отправка сформированного заказа на сервер
### Интерфейс `IUserInfo`
Будет исползован для типизации формы с данными пользователя. Свойства:
- `email: string` - почта пользователя
- `phone: string` - телефон пользователя
### Интерфейс `IPaymentInfo`
Будет исползован для типизации формы с оплатой. Свойства:
- `method: "online" | "offline"` - метод оплаты
- `address: string` - адрес для заказа
### Интерфейс `IOrder`
Расширет интерфейсы `IUserInfo, IPaymentInfo` для итогового объекта заказа. Свойства:
`totalPrice: number` - финальная цена продуктов
`products: string[]` - массив id продуктов из коризны
### Интерфейс `ICompleteOrder`
Будет использова для типизации финального окна успешной оплаты. Свойства:
- `id: string` - айди заказа
- `totalPrice: number` - сумма заказа
### Интерфейс `IForm`
Будет использова для создания универсального класса формы. Свойства:
- `valid: boolean` - состояние валидации формы
### Интерфейс `IModal`
Будет использован для создание универсального класса модального окна с динамическим контентом. Свойства:
- `view: HTMLElement` - динамечский контент внутри окна
### Интерфейс `IShopPage`
Будет использован для создания класса начальной страницы магазина. Содержит следующие свойства:
- `catalog: IProduct[]` - массив всех продуктов на странице
- `cartCounter: number` - счётчик товаров в корзине
### Интерфейс `IAppData`
Использован для реализации класса `AppData`  в котором будет реализована логика обработки данных и их хранение. Будет содержать следующие свойства и методы:
Свойства
- `catalog: IProduct[],` - весь каталог продуктов
- `cart: ICart` - товары добавленные в корзину
- `selectedProduct: string | null` - выбранный для просмотра продукт
- `order: IOrder` - объект итого заказа
Методы
- `setCatalog(products: IProduct[]): void` - получение стартового каталога
- `setSelectedProduct(product: IProduct): void` - получение продукта для показа в модальном окне
- `setBaseOrder(): IOrder` - eстановка стандартного значения магазина
- `addToCart(product: IProduct): void` - метод добавления в корзину заказа
- `removeFromCart(product: IProduct): void` - метод удаления из заказа
- `checkItemInCart(product: IProduct): boolean` - проверка наличия товара в корзине (для отображения кнопок)
- `getTotalPrice(): number` - получение финальной суммы заказа
- `setPaymentInfo(data: IPaymentInfo): void` - установка значений формы оплаты в заказ
- `setUserInfo(data: IUserInfo): void` - установка значений формы клиентских данных в заказ
- `sendOrder(): void` - переход к оплате заказа
## Базовые классы
### Класс `Api`
Класс c логикой для отправки запросов на сервер.
Конструктор принимает базовую ссылку и набор опций `baseUrl: string, options: RequestInit = {}`
- `get(uri: string):<Promise<T>>` - метод для отправки GET запроса на указанный адрес. Возвращает промис с полученным объектом
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - метод для отправки данных на сервер через POST запрос. Принимает адрес и объект с данными
### Абстрактный класс `Component<T>`
Нужен для создания компонентов и содержит методы для работы с этими компонентами
Конструктор принимает контейнер нужного элемента `container: HTMLElement`
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - метод для переключения класса элемента.  Принимает в параметрах нужынй элемент, наименование класса и опциональное значение для добавление или удаление класса
- `setText(element: HTMLElement, value: unknown)` - метод для утсановки текста. Принимает сам элемент и значенеи для установки
- `setDisabled(element: HTMLElement, state: boolean)` - метод для блокировки элемента. Принимает элемент и логическое значение для состояния
- `setHidden(element: HTMLElement)` - метод для скрытия элемента. Принимает сам элемент
- `setVisible(element: HTMLElement)` - метод для показа элемента. Принимает сам элемент
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - метод для установки алтернатвного текста и изображения. Принимает элемент, ссылку и опционально значение для альтернативного текста
- `render(data?: Partial<T>): HTMLElement` - метод для вывода корневого компонента. Опционально принимает данные
### Класс `EventEmitter`
Брокер событий для обработки и генерации событий. Имплементирует интерфейс `IEvents`
- `on` - метод для подписки на событие
- `off` - метод для отписки от события
- `emit` - метод для инициализации события
- `trigger` - метод для создания коллбэк триггера, который при вызове сгенерирует событие
- `onAll` - метод подписки  на все события
- `offAll` - метод отписки от всех событий
### Абстрактный класс `Model<T>`
Абстрактный класс для работы с данными.
Конструктор принимает необходимые данные и события `data: Partial<T>, protected events: IEvents`
- `emitChanges(event: string, payload?: object)` - метод для отправки событий с изменёнными данными
## Слой View
### Класс ProductCart extends Product<ICartProduct>
Класс представляет собой продукт, добавленный в корину
Конструктор принимает контейнер и список событий `container: HTMLElement, events?: { onClick: (event: MouseEvent) => void`
Свойства:
`_deleteButton: HTMLElement` - кнопка удаления товара
`_index: HTMLElement` - индекс товара
Методы:
`set index(value: number)` - установка индекса товара
### Класс Cart extends Component<ICart>
Класс представляет собой корзину
Конструктор принимает контейнер и список событий `container: HTMLElement, protected events: EventEmitter`
Свойства:
`_productsList: HTMLElement` - список товаров
`_totalPrice: HTMLElement` - итоговая цена всех товаров
`_orderButton: HTMLElement` - кнопка для оформления заказа
Методы:
`set products(products: HTMLElement[])` - добавляет выбранные товары в корзину
`set totalPrice(total: number)`  - устанавливает итоговую цену товара
### Класс Product<T extends IProduct | object> extends Component<T | IProduct>
Класс для отображения карточки товара
Конструктор принимает контейнер и список событий `container: HTMLElement, events?: { onClick: (event: MouseEvent) => void`
Свойства:
`_id: string` - id товара
`_title: HTMLElement` - заголовок товара
`_price: HTMLElement` - цена товара
`_image?: HTMLElement` - изображение товара
`_description?: HTMLElement` - описание товара
`_category?: HTMLElement` - категория товара
`_productButton?: HTMLElement` - кнопка в карточке товара
Методы:
`set id(value: string) / get id()` - метод установки/получения id
`set title(value: string) / get title()` - метод установки/получения заголовка
`set image(value: string)` - метод установки ссылки на изображение
`set description(value: string)` - метод установки описания
`set price(value: number)` - метод установки цены
`set category(value: string)` - метод установки категории
`set inCart(value: boolean)` - метод отслеживания добавления в крзину для рендера текста кнопки
### Класс Page extends Component<IShopPage>
Класс для реализации стартовой страницы
Конструктор принимает контейнер и список событий `container: HTMLElement, protected events: EventEmitter`
`_catalog: HTMLElement` - список товаров на странице
`_cartCounter: HTMLElement` - счетчик товаров в корзине
`_basket: HTMLElement` - иконка корзины
`_pageWrapper: HTMLElement` - обёртка страницы
Методы:
`set catalog(items: HTMLElement[])` - методы для вывода товаров на странице
`set cartCounter(value: number)` - методы для установки значения счётчика товаров
`set lockedWrapper(value: boolean)` - методы для блокировки обёртки страницы
### Класс Modal extends Component<IModal>
Класс для реализации модального окна
Конструктор принимает контейнер и список событий `container: HTMLElement, protected events: EventEmitter`
Свойства:
`_view: HTMLElement` - содержимое модального окна
`_closeButton: HTMLElement` - кнопка закрытия окна
Методы:
`set view(data: HTMLElement)` - установка содержимого окна
`open()` - метод открытия модального окна
`close()` - метод закрытия модального окна
### Класс Form<T> extends Component<IForm>
Класс для реализации форм для оформления заказа
Конструктор принимает контейнер и список событий `container: HTMLElement, protected events: EventEmitter`
Свойства:
`_submitButton: HTMLButtonElement` - кнопка перехода к следующему этапу
`_errorText: HTMLSpanElement` - ошибка при заполнении формы
Методы:
`set valid(value: boolean)` - метод блокировки/разблокировки кнопки оформления
`set errors(value: string[] | [])` - метод для вывода ошибок при заполнении
`onInputChange(form: 'userForm' | 'paymentForm')` - метод для проверки валидации при заполнении инпутов форм
### Класс PaymentForm extends Form<IPaymentInfo>
Класс для реализации формы способа оплаты
Конструктор принимает контейнер и список событий `container: HTMLElement, protected events: EventEmitter`
Свойства:
`_onlineButton: HTMLElement` - кнопка выбора оплаты картой
`_offlineButton: HTMLElement` - кнопка выбора оплаты наличкой
`_address: HTMLInputElement` - инпут для ввода адреса
`_currentMethod: 'offline' | 'online' | ''` - текущий выбранный метод оплаты
Методы:
`set address(value: string) / get address` - установка / получение значения адреса
`set method(value: 'offline' | 'online' | '') / get method` - установка / получение значения способа оплаты
`checkFormValidity()` - проверка валидности формы
### Класс userForm extends Form<IUserInfo>
Класс для реализации формы клиентских данных
Конструктор принимает контейнер и список событий `container: HTMLElement, protected events: EventEmitter`
Свойства:
`_phone: HTMLInputElement` - инпут для ввода телефона
`_email: HTMLInputElement` - инпут для ввода почты
Методы:
`set email(value: string) / get email()` - установка / получение значения почты
`set phone(value: string) / get phone()` - установка / получение значения телефона
`checkFormValidity()` - проверка валидности введённых данных
### Класс CompleteOrder extends Component<ICompleteOrder>
Класс для реализации финального окна успешной оплаты
Конструктор принимает контейнер и список событий `container: HTMLElement, events?: { onClick: (event: MouseEvent) => void`
Свойства:
`_exitButton: HTMLElement` - кнопка для выхода на стартовый экрна
`_total: HTMLElement` - итоговая стоимость покупок
Методы:
`set total(value: number)` - метод установки итоговой стоимости заказа
## Слой Model
### Класс AppData implements IAppData
Класс реализует интерфейс `IAppData` и отвечает за обущю бизнесл логику приложения
Конструктор принимает список событий `events: IEvents`
## Сервисные классы
### Класс LarekApi extends Api implements IShopApi
Реализует механизм взаимодействия с сервером
Конструктор принимает базовую ссылку и набор опций `baseUrl: string, options?: RequestInit`
Методы:
`getCatalog(): Promise<IProduct[]>` - метод получения каталога с сервера
`getProductById(id: string): Promise<IProduct>` - метод получения товара по id
`order(order: IOrder): Promise<ICompleteOrder>` - метод отправки заказа на сервер
## Слой Presenter
В качестве презентера будет использован код в файле `src\index.ts`, где будет собрано и всё приложение из всех остальных файлов.
## Список событий в приложении
Содержит следующие события:
- `store:init` - инициализация магазина, получение списка товаров
- `product:click` - нажатие на карточку продукта, выбирает продукт
- `product:open` - открывает карточку выбранного продукта
- `modal:open` - открывает модальное окно
- `modal:close` - закрывает модальное окно
- `cart:render` - открывает корзину с товарами
- `cart:add` - добавляет выбранный товар в корзину
- `cart:remove` - удаляет товар из корзины
- `counter:update` - обновляет счетчик товаров в корзине
- `paymentForm:render` - открывает форму оплаты
- `paymentForm:change` - отслеживает изменения инпутов в форме оплаты
- `paymentForm:submit` - переходит от формы оплаты к форме персональнх данных
- `userForm:render` - открывает форму персональных данных
- `userForm:change` - отслеживает изменения инпутов в форме персональных данных
- `userForm:submit` - переходит к отправке данных на сервер
- `order:send` - отправляет данные заказа на сервер
- `order:success` - отображает окно успешной оплаты

