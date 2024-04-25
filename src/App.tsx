/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './App.scss';

import { Config, MessageType, ValidateFn } from './domain/types';
import useGenerator from './domain/useGenerator';

type AppProps = { config: Config };

type FieldProps = {
    formKey: string
    label: string
    value: string
    onChange: (key: string, val: string) => void
    validateFunction: ValidateFn
};

type ResultProps = { command: string };

const checkNotEmpty: ValidateFn = (value) => {
    return value.trim().length !== 0
}

function App({ config }: AppProps) {
    const [type, setType] = React.useState<MessageType>('notification');
    const {
        title,
        body,
        token,
        data,
        command,
        jsonInvalid,
        setFormKey,
        generate
    } = useGenerator(config);

    if (config.firebaseServerKey.length === 0) {
        return (
            <div className="container pt-5">
                <AlertMessage />
            </div>
        );
    }

    const submitDisabled = (): boolean  => {
        if (jsonInvalid || token.trim().length === 0) {
            return true;
        }

        if (type === 'notification') {
            return title.trim().length === 0
            || body.trim().length === 0
        }

        return false;
    }
    
    return (
        <div className="container pt-5">
            <header className="is-size-1 has-text-centered has-text-primary">
                Firebase Message Generator
            </header>
            <div className="py-6">
                <div className="is-flex is-justify-content-center mb-5">
                    <div className="tabs is-toggle is-toggle-rounded">
                        <ul>
                            <li className={type === 'notification' ? 'is-active': ''}>
                                <a
                                    href="#"
                                    role='button'
                                    onClick={() => {setType('notification')}}
                                >
                                    Notification
                                </a>
                            </li>
                            <li className={type === 'message' ? 'is-active': ''}>
                                <a
                                    href="#"
                                    role='button'
                                    onClick={() => {setType('message')}}
                                >
                                    Message
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card">
                    <div className="card-content">
                        <div className="content">

                            {type === 'notification' ? (
                                <div className="columns">
                                    <div className="column">
                                        <Field
                                            label='Title'
                                            formKey='title'
                                            value={title}
                                            onChange={setFormKey}
                                            validateFunction={checkNotEmpty}
                                        />
                                    </div>
                                    <div className="column">
                                        <Field
                                            label='Body'
                                            formKey='body'
                                            value={body}
                                            onChange={setFormKey}
                                            validateFunction={checkNotEmpty}
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <Field
                                label='Device Firebase token'
                                formKey='token'
                                value={token}
                                onChange={setFormKey}
                                validateFunction={checkNotEmpty}
                            />

                            <div className="field">
                                <label className="label">Data</label>
                                <div className="control">
                                    <textarea
                                        className={`textarea ${jsonInvalid && 'is-danger'}`}
                                        value={data}
                                        onChange={e => setFormKey('data', e.target.value)}
                                    />
                                    {jsonInvalid ? (
                                        <p className="help is-danger">JSON format is not valid</p>
                                    ): null}
                                </div>
                            </div>

                            <div className="has-text-centered">
                                <button
                                    className="button is-primary"
                                    onClick={() => generate(type)}
                                    disabled={submitDisabled()}
                                >
                                    Generate cURL command
                                </button>
                            </div>
                            {command ? (
                                <Result command={command} />
                            ): null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AlertMessage = () => (
    <article className="message is-danger">
        <div className="message-header">
            <p>The Firebase server key not set</p>
        </div>
        <div className="message-body">
            Please set the <code>REACT_APP_FIREBASE_SERVER_KEY</code> variable into the <code>.env</code> file.<br />
            Then restart the app
        </div>
        </article>
);

const Field = ({
    formKey,
    label,
    value,
    onChange,
    validateFunction,
}: FieldProps) => {
    const isInvalid = !validateFunction(value)
    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <input
                    className={`input ${isInvalid && 'is-danger'}`}
                    type="text"
                    value={value}
                    onChange={(event) => onChange(formKey, event.target.value)}
                />
                {isInvalid ? (
                    <p className="help is-danger">Required</p>
                ): null}
            </div>
        </div>
    )
};

const Result = ({ command }: ResultProps) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(command);
    };

    return (
        <article className="message is-success my-3">
            <div className="message-header">
                <div className="is-size-3">cURL command</div>
                <button className="button" onClick={handleCopy}>Copy to clipboard</button>
            </div>
            <div className="message-body">
                <pre>{command}</pre>
            </div>
        </article>
    );
};
export default App;
