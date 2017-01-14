<link rel="stylesheet" href="http://beta.growthfountain.com/css/main2.css" />
<style>body {width: 100em;}</style>
Примеры использовання кнопок
  BTN
  <table>
    <tr>
      <td class="text-xs-center">
        <button type="button" class="btn btn-lg m-b-1" name="" value="btn-lg">LG</button>
        <button type="button" class="btn m-b-1" name="" value="btn">BTN</button>
        <button type="button" class="btn btn-sm" name="" value="btn-sm">SM</button>
      </td>
      <td>
      ```
        <button type="button" class="btn btn-lg" name="" value="btn-lg">LG</button>
        <button type="button" class="btn" name="" value="btn">BTN</button>
        <button type="button" class="btn btn-sm" name="" value="btn-sm">SM</button>
      ```
      </td>
    </tr>
  </table>
  <div class="col-lg-4">BTN-PRIMARY
    <button type="button" class="btn btn-lg btn-primary" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-primary" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-primary" name="" value="btn-sm">SM</button></div>
  <div class="col-lg-4">BTN-PRIMARY-OUTLINE
    <button type="button" class="btn btn-lg btn-primary-outline" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-primary-outline" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-primary-outline" name="" value="btn-sm">SM</button></div>
  <div class="col-lg-4">BTN-SECONDARY
    <button type="button" class="btn btn-lg btn-secondary" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-secondary" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-secondary" name="" value="btn-sm">SM</button></div>
  <div class="col-lg-3">BTN-SUCCESS
    <button type="button" class="btn btn-lg btn-success" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-success" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-success" name="" value="btn-sm">SM</button></div>
  <div class="col-lg-3">BTN-DANGER
    <button type="button" class="btn btn-lg btn-danger" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-danger" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-danger" name="" value="btn-sm">SM</button></div>
  <div class="col-lg-3">BTN-BLOCK
    <button type="button" class="btn btn-lg btn-block" name="" value="btn-lg">LG</button>
    <button type="button" class="btn btn-block" name="" value="btn">BTN</button>
    <button type="button" class="btn btn-sm btn-block" name="" value="btn-sm">SM</button></div>
  <div class="col-lg-3">BTN-SOCIAL
    <button class="btn btn-block btn-lg btn-facebook text-uppercase"><i class="fa fa-facebook"></i>Facebook</button>
    <button class="btn btn-block btn-lg btn-linkedin text-uppercase"><i class="fa fa-linkedin"></i>linkedin</button>
    <button class="btn btn-block btn-lg btn-google text-uppercase"><i class="fa fa-google-plus"></i>Google</button></div> 
<br>  
<h2 class="text-xs-center">Стили для кнопок находятся в файле unique/buttons.sass</h2>

### <p>В файле unique/buttons  можно менять цвета / размер шрифта только для (btn) /</p>
    .btn
      background: $btn-bg
      color: $btn-color
      border-color: $btn-border
      letter-spacing: 2px
      border: 2px solid $btn-border
      font-size: rem(13)
      text-transform: uppercase
      +mt(.2s)
      &:hover
        background: $btn-hover-bg
        color: $btn-hover-color
        border-color: $btn-border
        +mt(.2s)
        .fa-angle-right
          padding-left: 5px

  
### <p>Размеры шрифтов для кнопок находятся в файле unique/_variables.sass</p> 
      $font-size-lg:               .8125rem 
      $font-size-sm:               .6875rem
    

### <p>Отступы (padding)  находятся в файле unique/_variables.sass</p>
    $btn-padding-x-lg: 44px // left - right
    $btn-padding-y-lg: 8px // top - bottom
    $btn-padding-x-sm: 14px
    $btn-padding-y-sm: 3px
    $btn-padding-y:    5px
    $btn-padding-x:    37px

### <p>BORDER-RADIUS для кнопок в файле unique/_variables.sass</p>
      $btn-border-radius-lg: 1px
      $btn-border-radius-sm: 1px
