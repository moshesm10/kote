<?php

file_put_contents("../emails.txt", $_POST['email'] . "\n", FILE_APPEND);
