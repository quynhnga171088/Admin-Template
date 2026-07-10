import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import '@/pages/categories/CategoriesList.scss';
import { ROLES_FOR_ADMIN, SCREENS_PATH } from '@/config/constant';
import { queryKeys } from '@/lib/queryKeys';
import { fetchAllCategories, deleteCategory } from '@/pages/categories/categories.services';
import type { IAuthState, ICategory } from '@/types/types';
import { authStore } from '@/stores/auth.store';

const CategoriesList = () => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const user = authStore((state: IAuthState) => state.user);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: fetchAllCategories
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }).then(() => setDeletingId(null));
    }
  });

  const handleDelete = (category: ICategory) => {
    if (!window.confirm(`Delete category "${category.categoryName}"?`)) return;
    setDeletingId(category.id);
    deleteMutation.mutate(category.id);
  };

  return (
    <div className="common-list categories-list">
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <div className="card-header-title">
            <i className="fa-regular fa-tags mr-2!" /> Categories
          </div>
          <Link to={SCREENS_PATH.CATEGORY_ADD_NEW} className="btn btn-primary btn-sm">
            <i className="fa-regular fa-plus" /> Add New
          </Link>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-24 gap-4 common-item common-item-label">
            <div className="col-span-7 flex items-center card-header-title">Category</div>
            <div className="col-span-12 flex items-center card-header-title">Description</div>
            <div className="col-span-5 flex justify-end items-center card-header-title">Action</div>
          </div>
          {categories.length === 0 && !isLoading && (
            <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">No category found.</div>
          )}
          {categories.map((category: ICategory) => (
            <div key={category.id} className="grid grid-cols-24 gap-4 common-item cursor-pointer">
              <div className="col-span-7 flex items-center card-header-title">
                {category.avatar &&
                  <div className="category-avatar">
                    <i className={category.avatar} />
                  </div>}
                <div className="truncate w-full ml-2!">{category.categoryName}</div>
              </div>
              <div className="col-span-12 flex items-center common-content" title={category.description}>
                <div className="truncate w-full">{category.description}</div>
              </div>
              <div className="col-span-5 flex justify-end items-center">
                <Link className="btn btn-light-warning btn-icon btn-sm ml-0.5! no-underline" title="Edit" to={SCREENS_PATH.CATEGORY_EDIT(category.id)}>
                  <i className="fa-regular fa-pen text-sm" aria-hidden="true" />
                </Link>
                {user && user.role && user.role === ROLES_FOR_ADMIN.ADMIN ?
                  <button className="btn btn-light-danger btn-icon btn-sm ml-0.5! no-underline"
                    title="Delete"
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                  >
                    <i className="fa-regular fa-trash text-sm" aria-hidden="true" />
                  </button>
                  : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;
export { CategoriesList as Component };
