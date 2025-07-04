#!/bin/bash
cd /home/kavia/workspace/code-generation/animalsketch-arena-107211-bd8b7fa0/frontend_react_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

