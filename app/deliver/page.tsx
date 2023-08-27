'use client'
import {Fragment, useEffect, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {Overlay} from "next/dist/client/components/react-dev-overlay/internal/components/Overlay";
import Header from "@/app/deliver/header";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import {BASE_HOST} from "@/config";

type Product = {
    _id: any,
    serialNumber: number,
    name: string,
    amount: number,
    thumbnail: string,
    url: string
}

export default function Deliver() {
    const [showModal, setShowModal] = useState(false)
    const [modalConfig, setModalConfig] = useState({
        title: '',
        contents: ''
    })
    const [products, setProducts] = useState<Product[]>([
        {
            _id: 1,
            serialNumber: 1,
            name: '数据正在载入',
            amount: 1,
            thumbnail: '',
            url: ''
        }
    ])
    const cancelButtonRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [seconds, setSeconds] = useState(0)
    const [interrupt, setInterrupt] = useState(false)
    const [error, setError] = useState('')
    const [cart, setCart] = useState<Product[]>([])
    const [showCart, setShowCart] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const showAlert = (title: string, contents: string) => {
        setModalConfig({
            title,
            contents
        })
        setShowModal(true)
    }
    const addToCart = (product: Product) => {
        setInterrupt(true)
        if (product.amount <= 0) {
            showAlert('抱歉，该商品库存不足', '请考虑选择其他商品')
            setInterrupt(false)
            return
        }
        let existedItems: Product[] = []
        cart.forEach(c => {
            if (c === product) {
                existedItems.push(c)
            }
        })
        if (existedItems.length >= 2) {
            showAlert('抱歉，该商品已超过单件限额', `[商品ID] ${product.serialNumber}, [内部ID] ${product._id}, [商品名] ${product.name}, 已经超过单件限额，您已经选择了 ${existedItems.length} 件该商品，请考虑选择其他商品。`)
            setInterrupt(false)
            return
        }
        if (cart.length >= 5) {
            showAlert('抱歉，您已达到限额', `根据规则，每个参赛队伍最多选择5件商品。`)
            setInterrupt(false)
            return
        }
        let newProducts = products
        newProducts.forEach(np => {
            if (np === product) {
                np.amount -= 1
            }
        })
        setProducts(newProducts)
        setCart([...cart, product])
        setInterrupt(false)
    }
    const openCart = () => {
        setInterrupt(true)
        setShowCart(true)
    }
    const removeFromCart = (product: Product) => {
        let newCart: Product[] = []
        let thisKind: Product[] = []
        cart.forEach(c => {
            if (c._id === product._id) {
                thisKind.push(c)
            } else {
                newCart.push(c)
            }
        })
        if (thisKind.length <= 1) {
            setCart(newCart)
            return
        } else {
            thisKind.shift()
            setCart([...newCart, ...thisKind])
        }
    }
    const checkout = () => {
        if (cart.length < 5) {
            showAlert('您需要选择5件商品', `抱歉，根据规则，每个参赛队伍须5件商品，当前选择${cart.length}件商品。`)
            return
        }
        let productIdList: any[] = []
        cart.forEach(c => {
            productIdList.push(c._id)
        })
        let idString = ''
        productIdList.forEach(p => {
            idString += p + ','
        })
        idString.substring(0, idString.length - 1)
        router.push(`/checkout?tn=${searchParams.get('tn')}&pn=${searchParams.get('pn')}&_ids=${idString}`)
    }

    const openURL = (url: string) => {
        if(url) {
            window.open(url)
        }else {
            showAlert('无法打开界面', '没有提供详情页')
        }
    }

    useEffect(() => {
        let timer = setInterval(async () => {
            if (seconds <= 0) {
                if (interrupt) {
                    return
                } else {
                    setLoading(true)
                    try {
                        const data = await fetch(`${BASE_HOST}/api/v1/product`).then(res => res.json())
                        if (data as Product[]) {
                            for (let i = 0; i < data.length; i++) {
                                for (let j = 0; j < cart.length; j++) {
                                    if (data[i]._id === cart[j]._id) {
                                        data[i].amount -= 1
                                    }
                                }
                            }
                            setProducts(data)
                            setLoading(false)
                        }
                        setSeconds(60)
                    } catch (e) {
                        if (e) {
                            showAlert('载入失败', '请检查网络连接')
                        }
                        setLoading(false)
                    }
                    setSeconds(10)
                }
            } else {
                setSeconds(seconds - 1)
            }
        }, 1000)
        return () => clearInterval(timer);
    }, [products, seconds, interrupt]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetch(`${BASE_HOST}/api/v1/product`).then(res => res.json())
                if (data) {
                    setProducts(data)
                    setLoading(false)
                }
                setSeconds(10)
            } catch (e) {
                if (e) {
                    showAlert('载入失败', '请检查网络连接')
                }
                setLoading(false)
            }
            setLoading(false)
        })()
    }, []);

    return (<>
            <Header onOpenCart={openCart}/>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 pt-20 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h3 className="text-sm font-medium pt-10 text-gray-300">下一次更新库存信息在{seconds}秒后</h3>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">挑选适合你的硬件</h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <div key={product._id} className="group relative">
                                <div
                                    className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.thumbnail}
                                        width={100}
                                        height={100}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{'ID ' + product.serialNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 text-center">{product.amount > 0 ? '库存' + product.amount : '库存告罄'}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-1">
                                    <div
                                        onClick={() => addToCart(product)}
                                        className="cursor-pointer mt-4 block mb-10 w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {product.amount > 0 ? '加入购物车' : '库存告罄'}
                                    </div>
                                    <div
                                        onClick={() => openURL(product.url)}
                                        className="cursor-pointer mt-4 block mb-10 w-full rounded-md bg-gray-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                    >
                                        了解详情
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Transition.Root show={showCart}>
                <Overlay className="relative z-50">
                    <Transition.Child
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
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div className="bg-white lg:mx-10 rounded flex flex-col ">
                                    <div
                                        className="mx-auto max-w-2xl px-4 pt-20 py-10 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
                                        <h2 className="flex justify-between text-2xl font-bold tracking-tight text-gray-900">您的购物车({cart.length + '/5'})
                                            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => {
                                                setShowCart(false)
                                                setInterrupt(false)
                                            }}>x</span>
                                        </h2>
                                        <div
                                            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                                            {cart.map((product) => (
                                                <div key={product._id + '_' + Math.random() * 100}
                                                     className="group relative">
                                                    <div
                                                        className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            src={product.thumbnail}
                                                            alt={product.thumbnail}
                                                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                        />
                                                    </div>
                                                    <div className="mt-4 flex justify-between">
                                                        <div>
                                                            <h3 className="text-sm text-gray-700">
                                                                {product.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">{'ID ' + product.serialNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between gap-1">
                                                        <div
                                                            onClick={() => removeFromCart(product)}
                                                            className="cursor-pointer mt-4 block mb-10 w-full rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                        >
                                                            删除购物车
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {
                                        cart.length !== 0 &&
                                        <div
                                            onClick={() => checkout()}
                                            className="mx-10 box-border cursor-pointer mt-4 block mb-10 rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            我选好了
                                        </div>
                                    }
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Overlay>
            </Transition.Root>
            <Transition.Root show={loading}>
                <Overlay className="relative z-50">
                    <Transition.Child
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
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded box-border">
                                    <div className="sm:flex sm:items-start">
                                        <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                                数据正在载入，请稍等...
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Overlay>
            </Transition.Root>
            <Transition.Root show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setShowModal}>
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
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setShowModal(false)}
                                        >
                                            好
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setShowModal(false)}
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
