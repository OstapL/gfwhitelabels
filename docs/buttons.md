Примеры использовання кнопок
  BTN
    <button type="button" class="btn btn-lg" name="" value="btn-lg">LG</button>
    <button type="button" class="btn" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm" name="" value="btn-sm">SM</button>
  BTN-PRIMARY
    <button type="button" class="btn btn-lg btn-primary" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-primary" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-primary" name="" value="btn-sm">SM</button>
  BTN-PRIMARY-OUTLINE
    <button type="button" class="btn btn-lg btn-primary-outline" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-primary-outline" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-primary-outline" name="" value="btn-sm">SM</button>
  BTN-SECONDARY
    <button type="button" class="btn btn-lg btn-secondary" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-secondary" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-secondary" name="" value="btn-sm">SM</button>
  BTN-SUCCESS
    <button type="button" class="btn btn-lg btn-success" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-success" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-success" name="" value="btn-sm">SM</button>
  BTN-DANGER
    <button type="button" class="btn btn-lg btn-danger" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-danger" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-danger" name="" value="btn-sm">SM</button>
  BTN-BLOCK
    <button type="button" class="btn btn-lg btn-block" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-block" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-block" name="" value="btn-sm">SM</button>
  BTN-SOCIAL
    <button class="btn btn-block btn-lg btn-facebook text-uppercase"><i class="fa fa-facebook"></i>Facebook</button>
    <button class="btn btn-block btn-lg btn-linkedin text-uppercase"><i class="fa fa-linkedin"></i>linkedin</button>
    <button class="btn btn-block btn-lg btn-google text-uppercase"><i class="fa fa-google-plus"></i>Google</button>
    
Custom стили кнопок а именно background, color, лежат в файле bootstrap_c/_buttons.sass.
  .btn
    background: $btn-bg
    color: $btn-color
    border-color: $btn-border
    letter-spacing: 2px
    border: 2px solid $btn-border
    font-size: rem(12)
    +mt(.2s)
    &:hover
      background: $btn-hover-bg
      color: $btn-hover-color
      border-color: $btn-border
      +mt(.2s)

Размеры шрифтов для кнопок находятся в файле bootstrap_c/_variables.sass
  $font-size-lg:               .8125rem 
  $font-size-sm:               .6875rem

Отступы  находятся в файле bootstrap_c/_variables.sass
  $btn-padding-x-lg: 44px
  $btn-padding-y-lg: 8px
  $btn-padding-x-sm: 14px
  $btn-padding-y-sm: 3px
  $btn-padding-y:    5px
  $btn-padding-x:    37px

BORDER-RADIUS для кнопок в файле bootstrap_c/_variables.sass
  $btn-border-radius: $border-radius
  $btn-border-radius-sm: $border-radius
  $btn-border-radius-lg: $border-radius

Переменные с цветами находятся в файле config/_vars.sass
  $btn-color: #197471
  $btn-border: #197471
  $btn-bg: transparent
  $btn-hover-bg: #197471
  $btn-hover-color: #fff

Переменные с цветами для кнопок соц.сетей находятся в файле common/_vars.sass
  $btn-facebook-bg: #3b5998
  $btn-facebook-hover-bg: rgba(59, 89, 152, .6)

  $btn-linkedin-bg: #257ebb
  $btn-linkedin-hover-bg: rgba(37,126,187, .6)

  $btn-google-bg: #d44330
  $btn-google-hover-bg: rgba(212,67,48, .6)