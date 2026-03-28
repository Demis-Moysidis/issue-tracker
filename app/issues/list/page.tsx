import Pagination from '@/app/components/Pagination';
import { prisma } from '@/prisma/client';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';
import IssueTable, { columnNames, IssueQuery } from './IssueTable';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';

interface Props {
  searchParams: IssueQuery
}

const IssuesPage = async ({ searchParams }: Props) => {
  const searchParamsAwait = await searchParams;

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParamsAwait.status)
    ? searchParamsAwait.status
    : undefined;
  const where = { status };

  const orderBy = columnNames
    .includes(searchParamsAwait.orderBy)
    ? { [searchParamsAwait.orderBy]: 'asc' }
    : undefined;

  const page = parseInt(searchParamsAwait.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParamsAwait} issues={issues}/>
      <Pagination 
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  )
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues'
};

export default IssuesPage