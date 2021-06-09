<template>
    <div id="app">
        <b-container fluid>
            <router-view/>
        </b-container>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    }
}
</script>

<style>
    @font-face {
        font-family: IRANSans;
        font-style: normal;
        font-weight: bold;
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_Bold.eot');
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_Bold.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/iransans/woff2/IRANSansWeb_Bold.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/iransans/woff/IRANSansWeb_Bold.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/iransans/ttf/IRANSansWeb_Bold.ttf') format('truetype');
    }
    @font-face {
        font-family: IRANSans;
        font-style: normal;
        font-weight: 500;
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_Medium.eot');
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_Medium.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/iransans/woff2/IRANSansWeb_Medium.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/iransans/woff/IRANSansWeb_Medium.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/iransans/ttf/IRANSansWeb_Medium.ttf') format('truetype');
    }
    @font-face {
        font-family: IRANSans;
        font-style: normal;
        font-weight: 300;
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_Light.eot');
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_Light.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/iransans/woff2/IRANSansWeb_Light.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/iransans/woff/IRANSansWeb_Light.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/iransans/ttf/IRANSansWeb_Light.ttf') format('truetype');
    }
    @font-face {
        font-family: IRANSans;
        font-style: normal;
        font-weight: 200;
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_UltraLight.eot');
        src: url('./assets/fonts/iransans/eot/IRANSansWeb_UltraLight.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/iransans/woff2/IRANSansWeb_UltraLight.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/iransans/woff/IRANSansWeb_UltraLight.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/iransans/ttf/IRANSansWeb_UltraLight.ttf') format('truetype');
    }
    @font-face {
        font-family: IRANSans;
        font-style: normal;
        font-weight: normal;
        src: url('./assets/fonts/iransans/eot/IRANSansWeb.eot');
        src: url('./assets/fonts/iransans/eot/IRANSansWeb.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/iransans/woff2/IRANSansWeb.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/iransans/woff/IRANSansWeb.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/iransans/ttf/IRANSansWeb.ttf') format('truetype');
    }

    @font-face {
        font-family: Shabnam;
        font-style: normal;
        font-weight: bold;
        src: url('./assets/fonts/shabnam/Shabnam-Bold-FD.eot');
        src: url('./assets/fonts/shabnam/Shabnam-Bold-FD.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/shabnam/Shabnam-Bold-FD.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/shabnam/Shabnam-Bold-FD.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/shabnam/Shabnam-Bold-FD.ttf') format('truetype');
    }
    @font-face {
        font-family: Shabnam;
        font-style: normal;
        font-weight: 200;
        src: url('./assets/fonts/shabnam/Shabnam-Light-FD.eot');
        src: url('./assets/fonts/shabnam/Shabnam-Light-FD.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/shabnam/Shabnam-Light-FD.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/shabnam/Shabnam-Light-FD.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/shabnam/Shabnam-Light-FD.ttf') format('truetype');
    }
    @font-face {
        font-family: Shabnam;
        font-style: normal;
        font-weight: normal;
        src: url('./assets/fonts/shabnam/Shabnam-FD.eot');
        src: url('./assets/fonts/shabnam/Shabnam-FD.eot?#iefix') format('embedded-opentype'),  /* IE6-8 */
        url('./assets/fonts/shabnam/Shabnam-FD.woff2') format('woff2'),  /* FF39+,Chrome36+, Opera24+*/
        url('./assets/fonts/shabnam/Shabnam-FD.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
        url('./assets/fonts/shabnam/Shabnam-FD.ttf') format('truetype');
    }
    body{
        background-color: #e9ecef !important;
        font-family: 'IRANSans', Sans-Serif !important;
    }
</style>
