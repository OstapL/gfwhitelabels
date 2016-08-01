define(function () {
    return `<section class="header_title">
        <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <h2><%- page.title %></h2>
            </div>
            <div class="col-lg-6 text-lg-right">
                <a href="/">Home</a>
                <span>/</span>
                <span class="curent"><%- page.title %></span>
            </div>
        </div>
    </section>

    <!-- Overview section -->
    <section class="text_block">
        <div class="container">
            <%= page.content %>
        </div>
    </section>
    <!-- End Overview section -->
`
})
