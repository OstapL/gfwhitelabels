define(function () {
    return {
        menu: `
        <li class="nav-item">
            <a class="nav-link" href="<%- Urls['campaign-list']() %>">
             <i class="fa fa-search"></i>
             Explore
            </a>
        </li>
        <li class="nav-item active">
        <a class="nav-link" href="#">About us 
          <i class="fa fa-angle-down"></i>
        </a>
        <div class="list-container">
          <ul class="submenu list-unstyled">
            <li>
            <a class="nav-link" href="/page/15/">Overview</a>
            </li>
            <li>
            <a class="nav-link" href="/page/17/">Team</a>
            </li>
            <li>
            <a class="nav-link" href="/page/18/">Partners</a>
            </li>
            <li>
            <a class="nav-link" href="/page/19/">Contact Us</a>
            </li>
            <li>
            <a class="nav-link" href="/page/20/">Careers</a>
            </li>
            <li>
            <a class="nav-link" href="/page/5/">In the News</a>
            </li>
          </ul>
        </div>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#">Resource center <i class="fa fa-angle-down"></i></a>
        <div class="list-container two-columns">
          <ul class="submenu list-unstyled">
            <li class="btn-sm">
            <p>For Investors</p>

            </li>
            <li>
            <a class="nav-link" href="/page/21/">Investor Tutorial</a>

            </li>
            <li>
            <a class="nav-link" href="/page/14/">Educational Materials</a>
            </li>
          </ul>

          <ul class="submenu list-unstyled">
            <li class="btn-sm">
            <p>For Businesses</p>
            </li>
            <li>
            <a class="nav-link" href="/page/21/">Business Tutorials</a>
            </li>
            <li>
            <a class="nav-link" href="/campaigns/">Campaign Material</a>
            </li>
            <li>
            <a class="nav-link" href="/page/22/">Success Guide</a>
            </li>
            <li>
            <a class="nav-link" href="/page/23/">Capital Raise Caculator</a>
            </li>
            <li>
            <a class="nav-link" href="/page/24/">What's My Business Worth?</a>
            </li>
            <li>
            <a class="nav-link" href="/page/11/">FAQ</a>
            </li>
          </ul>
        </div>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#">Advisor network 
          <i class="fa fa-angle-down"></i>
        </a>
        <div class="list-container">
          <ul class="  submenu list-unstyled">
            <li>
            <a class="nav-link" href="/page/13/">About</a>
            </li>

            <li>
            <a class="nav-link" href="/page/11/">FAQ</a>
            </li>
          </ul>
        </div>
        </li>
      </ul>`,

        notification: `<li class="nav-item notification text-center">
        <a href="#">
          <i class="fa fa-bell-o inline-block">
            <span class="count-notific">5</span>
          </i>
        </a>

        <div class="list-container ">

          <ul class="submenu list-unstyled ">
            <li class="clearfix title">
            <span class="pull-left inline-block"><b>5 pending</b> comments</span>
            <a class="inline-block pull-right" href="#">view all</a>
            </li>

            <li class="clearfix ">
            <span class="pull-left inline-block">Maria Kravchuk wrote...</span>
            <i class="inline-block pull-right">just now</i>
            </li>
            <li class="clearfix ">
            <span class="pull-left inline-block">Maria Kravchuk wrote...</span>
            <i class="inline-block pull-right">just now</i>
            </li>
            <li class="clearfix ">
            <span class="pull-left inline-block">Maria Kravchuk wrote...</span>
            <i class="inline-block pull-right">just now</i>
            </li>
            <li class="clearfix ">
            <span class="pull-left inline-block">Maria Kravchuk wrote...</span>
            <i class="inline-block pull-right">just now</i>
            </li>
            <li class="clearfix ">
            <span class="pull-left inline-block">Maria Kravchuk wrote...</span>
            <i class="inline-block pull-right">just now</i>
            </li>
          </ul>
        </div>
        </li>`,

        profile: `
        <% if(user.token != "") { %>
        <li class="nav-item notification text-center">
        <a href="#">
          <i class="fa fa-envelope-o">
            <span class="count-notific">5</span>
          </i>
        </a>
        </li>

        <li class="nav-item user-info">
        <a class="nav-link user-info-name" href="#">
          <span >
            <i class="fa fa-user"></i>
          </span>
          <%- model.get_full_name() %>
        </a>

        <div class="list-container user-info-drop">
          <ul class="submenu list-unstyled ">
            <li>
            <a class="nav-link" href="/account/profile/">Account</a>
            </li>

            <li>
            <a class="nav-link" href="<%- Urls['user:issuer_dashboard']() %>">Issuer Dashboard</a>
            </li>
            <li>
            <a class="nav-link" href="<%- Urls['user:investor_dashboard']() %>">Investor Dashboard</a>
            </li>
            <li>
            <a class="nav-link" href="/account/logout/">Log Out</a>
            </li>
          </ul>
        </div>
        </li>
     <% } else { %>
        <li class="nav-item">
            <a href="/account/login/" class="btn btn btn-default light_green text-uppercase">Log in</a> 
        </li>
        <li class="nav-item">
            <a href="/account/login/" class="btn btn btn-default light_green text-uppercase">Sign up</a> 
        </li>
    <% } %>`
    }
});
