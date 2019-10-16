<?php

    $app_files = json_decode(file_get_contents("app_files.json"), true);

    function get_include(){
        global $app_files, $build;
        $loc = "file-includes.html";
        if(file_exists("templates/$loc")) {
            $build .= "Appending File ($loc): Successfull<br/>";
            unset($app_files[$loc]);
            return file_get_contents('templates/'.$loc.'');
        }
    }

    $gstring = '<!DOCTYPE html>
<html style="max-width: 100%; overflow-x: hidden">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" href="includes/gpaging.css"/>
        <script src="includes/gpaging.js"></script>'.get_include().'
    </head>
    <body id="body">
    ';
    $build = "";

    foreach ($app_files as $loc => $ref ) {

        if (is_dir("templates/$loc")) {

            //

        } else if(file_exists("templates/$loc")) {

            $ext = strtolower(pathinfo("templates/$loc", PATHINFO_EXTENSION));

            if( $ext == "js" ) {

                $gstring .= '
        <script>
            '.file_get_contents("templates/$loc").'
        </script>
                ';

            } else if ( $ext == "css" ) {

                $gstring .= '
        <style>
            '.file_get_contents("templates/$loc").'
        </style>
                ';

            } else {

                    $gstring .= '          
        <div id="'.$ref[0].'" class="page transition-'.$ref[1].' '.$ref[2].'">
            '.file_get_contents('templates/'.$loc.'').'
        </div>
                    ';

            }

            $build .= "Appending File ($loc): Successfull<br/>";

        } else {

            $build .= "Appending File ($loc): File Not Found<br/>";

        }

    }

    $gstring .= '
    </body>
</html>
    ';

    ## echo $build;

    echo $gstring;