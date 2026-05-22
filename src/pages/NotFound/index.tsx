import { Link } from 'react-router-dom';
import { SCREENS_PATH } from 'src/config/constant';
import styles from './NotFound.module.scss';

const NotFoundPage = () => (
  <div className={styles.container}>
    <h1 className={styles.code}>404</h1>
    <p className={styles.message}>Page not found</p>
    <Link to={SCREENS_PATH.HOME as string} className={styles.link}>Go back home</Link>
  </div>
);

export default NotFoundPage;
export { NotFoundPage as Component };
