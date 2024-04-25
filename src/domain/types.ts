export type Config = {
  firebaseServerKey: string
  defaultTitle: string
  defaultBody: string
};

export type MessageType = 'message' | 'notification';

export type Message = {
  to: string
  notification?: Notification
  data?: object
  content_available?: boolean
}

export type Notification = {
  title: string
  body: string
}

export type UseGenerator = (config: Config) => ({
  title: string
  body: string
  data: string
  token: string
  jsonInvalid: boolean
  command: string | null
  setFormKey: (key: string, val: string) => void
  generate: (type: MessageType) => void
});

export type ValidateFn = (value: string) => boolean

export default {}