'use client'
import {Fragment, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {useRouter} from "next/navigation";

export default function Home() {
    const [teamName, setTeamName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showModal, setShowModal] = useState(false)
    const cancelButtonRef = useRef(null)
    const router = useRouter()
    const [modalConfig, setModalConfig] = useState({
        title: '你确定同意申领硬件要求',
        contents: '每个参赛队伍仅限领取一次，领取的硬件不超过5件，且单种硬件不超过2件。'
    })
    const [showConfirmButton, setShowConfirmButton] = useState(true)

    const submit = () => {
        setModalConfig({
            title: '你确定同意申领硬件要求',
            contents: '每个参赛队伍仅限领取一次，领取的硬件不超过5件，且单种硬件不超过2件。'
        })
        if (teamName.indexOf('=') !== -1 || teamName.indexOf('&') !== -1) {
            setShowConfirmButton(false)
            setModalConfig({
                title: '队伍名不允许特殊符号 = 和 &',
                contents: '不允许特殊符号 = 和 & 作为队伍名'
            })
            return
        }
        if (phoneNumber.indexOf('=') !== -1 || phoneNumber.indexOf('&') !== -1) {
            setShowConfirmButton(false)
            setModalConfig({
                title: '队伍名不允许特殊符号 = 和 &',
                contents: '不允许特殊符号 = 和 & 作为队伍名'
            })
            return
        }
        setShowModal(false)
        router.push(`/deliver?tn=${teamName}&pn=${phoneNumber}`)
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-50 w-auto"
                        src="https://objectproxy.1205.moe/firebasestorage.googleapis.com/v0/b/mikuproject-e9478.appspot.com/o/dh%2Fd%26e.png?alt=media"
                        alt="DFlyLabs"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        只需一步开始硬件申领
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                                参赛队伍名
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setTeamName(e.target.value)}
                                    id="teamName"
                                    name="teamName"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="phoneNumber"
                                       className="block text-sm font-medium leading-6 text-gray-900">
                                    对应的手机号码
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    teamName && phoneNumber && setShowModal(true)
                                }}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                确认
                            </button>
                        </div>
                        <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
                            每个参赛队伍仅限领取一次，领取的硬件不超过5件，且单种硬件不超过2件。
                        </p>
                    </form>
                </div>
            </div>
            <Transition.Root show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setShowModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div
                            className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3"
                                                              className="text-base font-semibold leading-6 text-gray-900">
                                                    {modalConfig.title}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {modalConfig.contents}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        {
                                            showConfirmButton &&
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => submit()}
                                            >
                                                好
                                            </button>
                                        }
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                setShowModal(false)
                                                setShowConfirmButton(true)
                                                setModalConfig({
                                                    title: '你确定同意申领硬件要求',
                                                    contents: '每个参赛队伍仅限领取一次，领取的硬件不超过5件，且单种硬件不超过2件。'
                                                })
                                            }}
                                            ref={cancelButtonRef}
                                        >
                                            取消
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
