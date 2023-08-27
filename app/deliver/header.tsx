import Image from "next/image";

export default function Header({onOpenCart}: { onOpenCart: any }) {
    return (
        <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <span className="sr-only">DFlyLabs</span>
                    <Image width={100}
                           height={30}
                           src={"https://objectproxy.1205.moe/firebasestorage.googleapis.com/v0/b/mikuproject-e9478.appspot.com/o/dh%2Fd%26e.png?alt=media"}
                           alt={"DFlyLabs"}/>
                </div>
                <div className="flex lg:flex-1 lg:justify-end">
                    <div onClick={() => onOpenCart(false)}
                         className="cursor-pointer text-sm font-semibold leading-6 text-gray-900">
                        购物车 <span aria-hidden="true">&rarr;</span>
                    </div>
                </div>
            </nav>
        </header>
    )
}
