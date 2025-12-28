import Link from "next/link";

type BreadcrumbItem = {
  name: string;
  path?: string;
};

type Props = {
  lists: BreadcrumbItem[];
};

export const Breadcrumb = ({ lists }: Props) => {
  return (
    <nav className="text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {lists.map(({ name, path }, index) => (
          <li key={index} className="flex items-center">
            {/* 最後の項目以外には「>」をつける */}
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}
            
            {path ? (
              <Link href={path} className="text-blue-600 hover:underline">
                {name}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};