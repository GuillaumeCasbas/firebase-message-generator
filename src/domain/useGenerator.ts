import React from 'react';

import {
  UseGenerator,
  Config,
  Message,
  MessageType,
} from './types';
import { COMMAND_BASE } from './config';

const useGenerator: UseGenerator = function (config: Config) {
  const [title, setTitle] = React.useState<string>(config.defaultTitle);
  const [body, setBody] = React.useState<string>(config.defaultBody);
  const [token, setToken] = React.useState<string>('');
  const [dataField, setDataField] = React.useState<string>('{ \n  "link": ""\n}');
  const [jsonInvalid, setJsonInvalid] = React.useState<boolean>(false);
  const [data, setData] = React.useState<object | null>({});
  const [command, setCommand] = React.useState<string | null>(null);

  const checkData = (val: string) => {
      setJsonInvalid(false);

      if (val.trim().length === 0) {
          setData(null);
      } else {
          try {
              setData(JSON.parse(val.trim()));
          } catch (error) {
              setData(null)
              setJsonInvalid(true);
          }
      }
      setDataField(val)
  }

  const handleStateChange = (key: string, val: string) => {
      switch (key) {
          case 'title':
              setTitle(val)
              break;
          case 'body':
              setBody(val)
              break;
          case 'token':
              setToken(val)
              break;
          case 'data':
              checkData(val)
              break;
          default:
              break;
      }
  }

  const generate = (type: MessageType) => {
      if (jsonInvalid) { return; }

      setCommand(null);

      let message: Message = {
        to: token,
    }

      if (type === 'notification')  {
            message = {
                ...message,
                content_available: true,
                notification: { title, body },
            }
      }

      if (data) {
          message = {
              ...message,
              data,
          };
      }

      setCommand(
          COMMAND_BASE
              .replace('_MESSAGE_', JSON.stringify(message))
              .replace('_SERVER_KEY_', config.firebaseServerKey)
      );
  }

  return {
      title,
      body,
      data: dataField,
      token,
      jsonInvalid,
      command,
      setFormKey: handleStateChange,
      generate,
  };
}

  export default useGenerator;
