#!/bin/bash
cd /home/kavia/workspace/code-generation/taskflow-organizer-2091-fecf991e/taskflow_frontend_workspace/taskflow_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

