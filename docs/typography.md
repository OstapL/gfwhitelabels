Шрифты
  подключение всех шрифтов находится в файле common/vars.sass
  Custom стили шрифтов в файле bootstarp_c/_type.sass
h1
  letter-spacing: 6px
  color: $black
  .small-text
    +calc-rem(11)
    letter-spacing: 2.8px
    display: block
    padding-top: 5px
    line-height: 14px
Размеры шрифтов в файле bootstarp_c/_variables.sass
  $font-size-h1:               1.875rem
  $font-size-h2:               1.5rem
  $font-size-h3:               1.125rem

Для использования дополнительного шрифта например досис используется клас
  .dosis
Пример
  h2.dosis

Ссылки
  .link-1 /.link-2 /.link-3 /.link-4 /.link-5 / .link-6
   Custom стили в файле bootstarp_c/_type.sass
   Цвета для hover ссылок находятся в файле config/_color.sass
Пример использования
  a(href="").link-2


