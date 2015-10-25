#!/bin/bash
rsync -e 'ssh -i ./id_dsa' -av -f"- .git/" --progress www/ zetlen@jameszetlen.com:~/jameszetlen.com/
