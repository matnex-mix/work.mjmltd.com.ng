GPageVar = {};
location.href = ('#');

function startLoading() {
    $loader = document.querySelector("body>.page-loader");
    doneL = 0; doneW = 0;
    window.onload = function(){
        if( doneL == 1 ){
            $loader.style.visibility = 'hidden';
        } else { doneW = 1; }
    };

    doneL = 1;
}

function bondAttributes(){
    $pages = document.querySelectorAll("body>.page");

    !$pages.length||$pages.forEach(function($page){
        $page.GPageLoad = [];
        $page.GPageLeave = [];
        $page.onGPageLoad = function($func){
            !(typeof this.GPageLoad == "object")||this.GPageLoad.push($func);
        }
        $page.onGPageLeave = function($func){
            !(typeof this.GPageLeave == "object")||this.GPageLeave.push($func);
        }
        $page.GPageLoadRun = function(){
            this.GPageLoad.forEach(function($funcs){
                $funcs();
            });
        }
        $page.GPageLeaveRun = function(){
            this.GPageLeave.forEach(function($funcs){
                $funcs();
            });
        }
    });
}

function doAll() {

    $main = document.getElementById("main");

    if($main) {
        $main.classList.toggle("active");
        $main.GPageLoadRun();
    }

}

document.addEventListener("DOMContentLoaded", function() {
    startLoading();
    bondAttributes();
    setTimeout(doAll, 50);
});

function GPageLoad($id, $func) {
    $el = document.getElementById($id);
    if ($el && $el.classList.contains("page") ) {
        $el.onGPageLoad($func);
    }
}

function GPageSet($id, $key) {
    $el = document.getElementById($id);
    if ($el && $el.classList.contains("page") && $key ) {
        if($key == "NO_HEADER") {
            $el.onGPageLoad(function(){
                $hd = document.getElementById("header");
                if($hd) {
                    $hd.classList.toggle("page-hidden");
                }
            });
            $el.onGPageLeave(function(){
                $hd = document.getElementById("header");
                if($hd) {
                    $hd.classList.toggle("page-hidden");
                }
            });
        } else if($key == "NO_FOOTER") {
            $el.onGPageLoad(function(){
                $hd = document.getElementById("footer");
                if($hd) {
                    $hd.classList.toggle("page-hidden");
                }
            });
            $el.onGPageLeave(function(){
                $hd = document.getElementById("footer");
                if($hd) {
                    $hd.classList.toggle("page-hidden");
                }
            });
        } else if( $key == "DISABLED" ) {
            GPageVar['DISABLED'] = GPageVar.DISABLED || [];
            GPageVar.DISABLED.push( $id );
        }
    }
}

function GPageData( key, value ) {
    haystack = document.querySelector( "[GPage-"+key+"]" );
    if( haystack ) {
        hayattr = haystack.getAttribute( "GPage-"+key );
        if( hayattr ) {
            haystack.setAttribute( hayattr, value );
        } else {
            haystack.innerText = value;
        }
    } else {
        return false;
    }
}

function GPage($id) {

    $el = document.getElementById($id);
    if ($el && $el.classList.contains("page") ) {
        $curr = document.querySelector(".page.active");
        $curr.classList.toggle("active");
        $curr.GPageLeaveRun();
        $el.classList.toggle("active");
        $el.GPageLoadRun();
    }

}

function defer($func){

    if(document.readyState == "loading") document.addEventListener("DOMContentLoaded", $func);
    else $func();

}

window.addEventListener("hashchange", function($ev){

    $page = $ev.newURL;
    $hi = $page.indexOf("#");

    if($hi == -1) { GPage("main"); return; }

    $hash = location.hash.substring(1)||"main";
    if( !GPageVar.DISABLED || GPageVar.DISABLED.indexOf( $hash ) == -1 ){
        GPage($hash);
    }

});