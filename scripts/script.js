if ($(window).width() < 767) {
    console.log("mobile beb")
    $(".ac-gn-list").html(`<li class="ac-gn-item ac-gn-apple">
					                    </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#"><div class="nav-link-text">Home</div></a></a>
                                        </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#About"><div class="nav-link-text">About</div></a></a>
                                        </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#MyArt"><div class="nav-link-text">My Art</div></a></a>
                                        </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#Contact"><div class="nav-link-text">Contact</div></a></a>
                                        </li>`);
} else {
    console.log("desktop beb")
    $("ul.ac-gn-list").html(`<li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#"><div class="nav-link-text">Home</div></a></a>
                                    </li>
                                    <li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#About"><div class="nav-link-text">About</div></a></a>
                                    </li>
                                    <li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#MyArt"><div class="nav-link-text">My Art</div></a></a>
                                    </li>
                                    <li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#Contact"><div class="nav-link-text">Contact</div></a></a>
                                    </li>`);
}

$(window).on('resize', function () {
    
    if ($(window).width() < 767) {
        console.log("mobile beb")
        $(".ac-gn-list").html(`<li class="ac-gn-item ac-gn-apple">
					                    </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#"><div class="nav-link-text">Home</div></a></a>
                                        </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#About"><div class="nav-link-text">About</div></a></a>
                                        </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#MyArt"><div class="nav-link-text">My Art</div></a></a>
                                        </li>
                                        <li class="ac-gn-item ac-gn-item-menu">
                                            <a class="ac-gn-link" href="#Contact"><div class="nav-link-text">Contact</div></a></a>
                                        </li>`);
    } else {
        console.log("desktop beb")
        $("ul.ac-gn-list").html(`<li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#"><div class="nav-link-text">Home</div></a></a>
                                    </li>
                                    <li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#About"><div class="nav-link-text">About</div></a></a>
                                    </li>
                                    <li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#MyArt"><div class="nav-link-text">My Art</div></a></a>
                                    </li>
                                    <li class="ac-gn-item ac-gn-item-menu">
                                        <a class="ac-gn-link" href="#Contact"><div class="nav-link-text">Contact</div></a></a>
                                    </li>`);
    }

});