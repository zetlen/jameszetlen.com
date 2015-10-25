#!/bin/bash
rsync -av -f"- .git/" --progress www/ zetlen@colonpipe.org:~/jameszetlen.com/
